
const app = Vue.createApp ({
    data () {
        return {
            email : null,
            passwd : null,
            pilot_selected : null,
            aposta_selected : null,
            qt_apostada : null,
            pilots: [
                {"id":"1", "nom":"John", "multiplicador": "1.1"},
                {"id":"2", "nom":"Steve", "multiplicador": "1.7"},
                {"id":"3", "nom":"Peter", "multiplicador": "3"} //PETER WAS ENDEED HANDLESS
            ],
            aposta: [
                {"id":"1", "nom":"guanyar", "valor":[2.0, 3.0]},
                {"id":"2", "nom":"podi", "valor":[1.5, 1.9]},
                {"id":"3", "nom":"posicioExacte", "valor":[2.0, 4.0]},
                {"id":"4", "nom":"mort", "valor":[4.0, 5.5]}
            ],
            multi: null,
            premi: null,
            errors: [],
            result: null,
            mostrarErrors: false,
        }
    },

    methods: {
        validarCamps ()
        {
            let valid = true;
        
            this.errors = [];
            
            let mail_valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!this.email) {
                this.errors.push('El mail es obligatorio');
                valid = false;
            }else if(!mail_valid.test(this.email)){
                this.errors.push('El mail no es valid');
                valid = false;
            }
            //el primer parentesis confirma que hi hagi una mayuscula una minuscula un digit i 
            //un caracter especial dels que es permet en qualsevol pocicio de la cadena ( / \ - ! ¡ ? ¿ % & =)
            //i el segon parentesis permet que es puguin escriure la quantitat de vegades que sigui els anteriors caracters
            let passwd_valid = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\/\\\-!¡?¿%&=])([A-Z]|[a-z]|\d|[\/\\\-!¡?¿%&=])*$/;
            if (!this.passwd) {
                this.errors.push('La contrassenya es obligatoria');
                valid = false;
            }else if(this.passwd.length < 5){
                this.errors.push('La contrassenya ha de tenir 5 caracters minim');
                valid = false;
            }else if(!passwd_valid.test(this.passwd)){
                this.errors.push('La contrassenya ha de tenir una mayuscula,\n una minuscula, un numero i un caracter especial ( / \ - ! ¡ ? ¿ % & = )');
                valid = false;
            }
            if (!this.pilot_selected) {
                this.errors.push('Has de escollir un pilot');
                valid = false;
            }
            if (!this.aposta_selected) {
                this.errors.push('Has de escollir la aposta');
                valid = false;
            }
            if (!this.qt_apostada || this.qt_apostada <= 0) {
                this.errors.push('Has de posar una quantitat valida');
                valid = false;
            }

            //Si hi han errors aleshores mostrem el div d'errors
            if (this.errors.length > 0)
            {
                this.mostrarErrors = true;
            }

            //guardar la aposta si tots els camps son valids
            if(valid){
                //recollim el array de apostes
                let ultimesApostes = JSON.parse(localStorage.getItem('ultimesApostes'));

                //comprovem si realment existien apostes si no declarem array
                let i = 1;
                if(ultimesApostes == null){
                    ultimesApostes = [];
                }else{
                    i = ultimesApostes[ultimesApostes.length -1 ].id;
                    i++;
                }
                
                let item = {
                    id : ""+i,
                    email : this.email,
                    pilot : this.pilot_selected,
                    aposta : this.aposta_selected,
                    qt : this.qt_apostada,
                    premi : this.premi,
                }

                //guardem la aposta nova
                ultimesApostes.push(item);
                //guardem el array de apostes amb el camp afegit
                localStorage.setItem('ultimesApostes', JSON.stringify(ultimesApostes));

                console.log(item);
                //mostrem la aposta realitzada al cap de 5 segons esborrem el dormulari i al cap de 7 esborrem el resultat
                this.mostrarAposta();
                setTimeout(this.resetFormulari, 5000);
                setTimeout(()=>{this.result = null}, 7000);
            }
        },
        amagarErrors ()
        {
            this.mostrarErrors = false;
        },
        amagarErrors ()
        {
            this.mostrarErrors = false;
        },
        generarAposta ()
        {
            if (this.pilot_selected != null && this.aposta_selected != null) {
                //busquem el pilot i la aposta dins dels arrays que tenim per generar els multiplicadors
                let p = this.pilots.find(this.findPilot);
                let a = this.aposta.find(this.findAposta);
                let arr_multi = this.multiplicador;

                console.log("Pilot: "+p.nom+" aposta: "+ a.nom);
                let multi = this.randomFloat(a.valor[0],a.valor[1]);
        
                let obj = {
                    "pilot": p.id, "aposta":a.id, "multi": multi,
                }

                //recollim el objecte amb els multiplicadors generats
                let multiplicador = JSON.parse(localStorage.getItem('multiplicador'));
                if (multiplicador == null){
                    multiplicador = [];
                }
                
                //console.log(multiplicador);
                //busqueda dins dels multiplicadors si ja ha estat generat;
                let repetit = multiplicador.findIndex((e)=>{
                    //console.log("e.pilot: "+e.pilot+" p: "+p.id+ " e.aposta: "+e.aposta+" a: "+a.id); 
                    return e.pilot == p.id && e.aposta == a.id;
                });
                //si no ha estat generat el guardem
                //console.log("repetit: "+repetit);
                if(repetit == -1){
                    multiplicador.push(obj);
                    localStorage.setItem('multiplicador', JSON.stringify(multiplicador));
                    repetit = multiplicador.length - 1;
                }

                //utilitzem el valor de repetit per saber quin es el multiplicador que s'ha de mostrar
                this.multi = multiplicador[repetit].multi.toFixed(2);

                //si els diners ja estan introduits s'actualitza el formulari
                this.calcularAposta();
            }
        },
        calcularAposta()
        {
            //calcul per mostrar el premi
            if((""+this.qt_apostada).trim().length > 0 && this.qt_apostada > 0 && this.multi != null){
                this.premi = (this.qt_apostada * this.multi).toFixed(2);
                console.log("Premi: "+this.premi)
            }else{
                this.premi = null
            }
        },
        //funcions de random i de busqueda
        randomFloat(min, max)
        {
            return Math.random()*(max-min)+min;
        }, 
        findPilot(e)
        {
            return e['id'] == this.pilot_selected;
        },
        findAposta(e)
        {
            return e['id'] == this.aposta_selected;
        }, 
        findMultiplicador(e)
        {
            return (e['pilot'] == this.pilot_selected && e['aposta'] == this.aposta_selected);
        },
        resetFormulari()
        {
            this.premi = null
            this.multi = null
            this.email = null
            this.passwd = null
            this.pilot_selected = null
            this.aposta_selected = null
            this.qt_apostada = null
            console.log("reset");
        }, 
        mostrarAposta()
        {
            let text = "";
            //TODO passar valor del pilot per fer el rand
            let guanyar = Math.random(); 

            text = "<p>Mail: "+this.email+"</p><p>Pilot: "+this.pilots[this.pilot_selected].nom+"</p><p>Aposta: "+this.aposta[this.aposta_selected].nom+"</p><p> Import: "+ this.qt_apostada+ "</p><p> Premi: "+this.premi+"</p>";
            if (guanyar <= '0.5') {
                text += "<p>Aposta guanyada :)</p>";
            } else {
                text += "<p>No has guanyat :(</p>";
            }

            this.result = text;
            console.log(this.result);
        }
    }

});

app.mount('#app')


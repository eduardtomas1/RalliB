
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
            dades: [],
            errors: [],
            mostrarErrors: false,
        }
    },

    methods: {
        validarCamps ()
        {
            let valid = true;
        
            this.errors = [];

            if (!this.email) {
                this.errors.push('El mail es obligatorio');
                valid = false;
            }
            if (!this.passwd) {
                this.errors.push('La contrassenya es obligatoria');
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
                let item = {
                    email : this.email,
                    pilot : this.pilot_selected,
                    aposta : this.aposta_selected,
                    qt : this.qt_apostada,
                    premi : this.premi,
                    }
                    this.dades.push(item)
                    localStorage.setItem('ultimaAposta', JSON.stringify(item));
                console.log(item);
            }else{
                //aposta no valida
            }
            
        },
        amagarErrors ()
        {
            this.mostrarErrors = false;
        },
        generarAposta ()
        {
            if (this.pilot_selected != null && this.aposta_selected != null) {
                
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
        calcularAposta(){
            if((""+this.qt_apostada).trim().length > 0 && this.qt_apostada > 0 && this.multi != null){
                this.premi = (this.qt_apostada * this.multi).toFixed(2);
                console.log("Premi: "+this.premi)
            }else{
                this.premi = null
            }
        },
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
        resetFormulari(){
            this.premi = null
            this.multi = null
            this.email = null
            this.psswd = null
            this.pilot_selected = null
            this.aposta_selected = null
            this.qt_apostada = null
            console.log("reset");
        }
    }

});

app.mount('#app')


//ester ha recomendat fer una funcio de rest i que pasat uns segons es nateji el formulari un cop les dades han estat enviades;
//si o si use del webStorage
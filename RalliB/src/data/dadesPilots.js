
const app = Vue.createApp ({
    data () {
        return {
            email : null,
            psswd : null,
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
            multiplicador : null,
        }
    },
    
    methods: {
        validarCamps ()
        {
            let item = {
                name : this.email,
                pilot : this.pilot_selected,
                aposta : this.aposta_selected,
                qt : this.qt_apostada,
                }
                this.dades.push(item)
            console.log(item)
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
                    "pilot": p.id, "aoposta":a.id, "multi": multi, 
                }

                
                //console.log(arr_multi.findIndex(this.findMultiplicador));

                if(this.multiplicador != null){
                    for(let i = 0; i < this.multiplicador.length; i++){
                        console.log(this.multiplicador[i]);
                    }
                }else{
                    this.multiplicador = [];
                    this.multiplicador.push(obj);
                }
                console.log(this.multiplicador);

                

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
        }
    }

});

app.mount('#app')


//ester ha recomendat fer una funcio de rest i que pasat uns segons es nateji el formulari un cop les dades han estat enviades;
//si o si use del webStorage

const app = Vue.createApp ({
    data () {
        return {
            email : null,
            psswd : null,
            pilot_selected : null,
            aposta_selected : null,
            qt_apostada : null,
            dades : [

            ],
            pilots: [
                {"nom":"John", "multiplicador": "1.1"},
                {"nom":"Steve", "multiplicador": "1.7"},
                {"nom":"Peter", "multiplicador": "3"} //PETER WAS ENDEED HANDLESS
            ],
            aposta: [
                {"nom":"guanyar", "valor":[2.0, 3.0]},
                {"nom":"podi", "valor":[1.5, 1.9]},
                {"nom":"posicioExacte", "valor":[2.0, 4.0]},
                {"nom":"mort", "valor":[4.0, 5.5]}
            ],
            multiplicador : function () {
                return {

                }
            }
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
                console.log("dins")
            }
        }
    }

});

app.mount('#app')

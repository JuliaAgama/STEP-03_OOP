;(function() {

    // Общий клсс
    class Visit {
        constructor(reason, date, name) {
            this.reason = reason;
            this.date = date;
            this.name = name;
        }
    }

    class Cardiologist extends Visit {
        constructor( { reason, date, name, ...other }){
            super(reason, date, name);

            for (let i in other) {
                this[i] = other[i];
            }
        }
    }
    
    class Dentist extends Visit {
        constructor( { reason, date, name, ...other }){
            super(reason, date, name);

            for (let i in other) {
                this[i] = other[i];
            }
        }
    }
    
    class Therapist extends Visit {
        constructor( { reason, date, name, ...other }){
            super(reason, date, name);

            for (let i in other) {
                this[i] = other[i];
            }
        }
    }

})();
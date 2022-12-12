//Name: Cooper Brown
//Date: 12/8/2022
//Class: CIS-131

//Word wrap recommended!

//#region ***Components***
Vue.component('movie', { //component used to generate each movie card
    template: `
    <div class="col-3 text-center mt-3">
        <div class="card mt-5 border border-2 rounded-2 border-dark" style="width: 100%;"> 
            <img :src="'https://image.tmdb.org/t/p/original/' + movieobj.poster_path"  class="card-img-top" alt="..."> 
            <div class="card-body ">
                <div class="row mt-3 mb-5 font-monospace">
                    <div class="col">
                        <button @click='adultpurchase' class="fs-6 btn btn-lg btn-dark btn-outline-light" type="submit">Adult Ticket</button>
                    </div>
                    <div class="col">
                        <button @click='childpurchase' class="fs-6 btn btn-lg btn-dark btn-outline-light" type="submit">Child Ticket</button>
                    </div>
                </div>
                <h5 class="card-title">{{movieobj.title}}</h5>
                <p class="card-text mt-3">{{movieobj.overview}}</p>
            </div>
            <div class="card-footer">
                <button @click='checkout' class="font-monospace btn btn-sm btn-dark btn-outline-light" type="submit">Check out</button>
            </div>
        </div>
    </div>
    `,
    props: ["movieobj", "index"], //takes in the movieobj supplied from the v-for in order to display that information to the user
    methods: {      //also takes the index of this specific movie component in order to send that up to our vue instance for use in functions
        childpurchase() //function that is used to send an emitter containing the index that is designated 'child' for distinction within the vue instance
        {               //this is so we can have two different functions for child tickets and adult.
            this.$emit('child', this.index);
        },
        adultpurchase() //function that is used to send an emitter containing the index that is designated 'adult' for distinction within the vue instance
        {
            this.$emit('adult', this.index);
        },
        checkout() //function that sends out an emitter that calls a function which increases a variable 'checkOut' by 1, allowing our shopping cart to display
        {
            this.$emit('check');
        }
    }
})

Vue.component('badge', { //component that is used to generate the buttons that delete tickets from both the child and adult arrays
    template: `
        <button @click="removeTicket" class=" btn btn-sm btn-dark btn-outline-light" type="submit">Remove Ticket</button>
        `,
    props: ["index"], //takes the index in order to know which movie we are removing a ticket for
    methods: {
        removeTicket(){
            this.$emit('remove', this.index); //sends an emitter with the index of the movie we are removing to the parent component <tablerow>
        }
    }
})

Vue.component('tablerow', { //component responsible for displaying each row of our chopping cart table
    template: `
    <tr>
        <th scope="row" style="width: 25%">{{movie.title}}</th>
        <td style="width: 25%">
            <div v-show="adult > 0" class="row">
                <div class="col-4">
                    {{adult}} x $6.99
                </div>
                <div class="col-6">
                    <badge :index="index" @remove="removeAdult($event)"></badge>
                </div>
                <div class="col-2"></div>
            </div>
        </td>
        <td style="width: 25%">
            <div v-show="child > 0" class="row">
                <div class="col-4">
                    {{child}} x $3.99
                </div>
                <div class="col-6">
                    <badge :index="index" @remove="removeChild($event)"></badge>
                </div>
                <div class="col-2"></div>
            </div>
        </td>
        <td style="width: 10%">&#36;{{sub}}</td>
        <td style="width: 15%"><button @click="removeMovie" class="btn btn-lg btn-dark btn-outline-light" type="submit">Remove Movie</button></td>
    </tr>
    `,
    props: ["movie", "adult", "child", "index", "sub"], //takes in the movie that is generated from our v-for, as well as the amount of tickets for adult
    methods: {//and child in order to display that to the user. Additionally it takes in the index in order to remove a movie as well as pass it to the badge component      
        removeAdult(e){//and finally it takes in the array that holds the subtotals for each of the movies that are being displayed in our shopping cart
            this.$emit('removeadult', e)
        }, //the remove adult function which sends an emitter to the parent component <checkout> containing the index that was
        removeChild(e){ //sent up from  <badge> component in order to remove an adult ticket
            this.$emit('removechild', e)//the remove child function which sends an emitter to the parent component <checkout> containing the index that was
        },                             //sent up from  <badge> component in order to remove a child ticket
        removeMovie(){
            this.$emit('removemovie', this.index) //the remove movie function sends an emitter containing the index of this tablerow's movie in order to remove it from the main array
        }
    }
})

Vue.component('checkout', { //the component that is used to display the table used for the shopping cart
    template: `
    <table v-show = "checkout > 0" class="table">
        <thead class="table-dark">
            <tr>
            <th scope="col" style="width: 25%">Movie</th>
            <th scope="col" style="width: 25%">Adult Tickets</th>
            <th scope="col" style="width: 25%">Children's Tickets</th>
            <th scope="col" style="width: 10%">Subtotal</th>
            <th scope="col" style="width: 15%"></th>
            </tr>
        </thead>
        <tbody>
            <tr is="tablerow" @removemovie="removeMovie($event)" @removechild="removeChild($event)" @removeadult="removeAdult($event)" v-for="(movie, index) in movies" :movie="movie" :adult="adult[index]" :child="child[index]" :index="index" :sub="sub[index]"></tr>
        </tbody>
        <tfoot>
            <tr class=""><td></td></tr>
            <tr v-show="totals.total > 0">
                <td></td>
                <td></td>
                <td>
                    Adult Subtotal: 
                </td>
                <td>
                    &#36;{{totals.totalAdult}}
                </td>
            </tr>
            <tr v-show="totals.total > 0">
                <td></td>
                <td></td>
                <td>
                    Child Subtotal:
                </td>
                <td>
                    &#36;{{totals.totalChild}}
                </td>
            </tr>
            <tr v-show="totals.total > 0">
                <td></td>
                <td></td>
                <td >
                    <b>Total:</b>
                </td>
                <td >
                    <b>&#36;{{totals.total}}</b>
                </td>
            </tr>
        </tfoot>
    </table>
    `,
    props: ['movies', 'checkout', 'adult', 'child', 'sub', 'totals'], //this component takes in the master array of movies that the user wishes to buy, along with that,
    methods: {//it contains the checkout variable in order to use v-show to display it when the user has selected a movie
        removeAdult(e){//additionally the adult and child ticket arrays are sent in to further send down into the child components
            this.$emit('removeadult', e)//lastly, the subtotals/total are sent down to display within the table footer
        },
        removeChild(e){
            this.$emit('removechild', e)
        },
        removeMovie(e){
            this.$emit('removemovie', e)
        }
    }
})
//#endregion


const app = new Vue({
    el: "#app",
    data: {
        url: "https://api.themoviedb.org/3/movie/now_playing?api_key=b7c82d15e3cce1e75e9457dd5478dfc2&language=en-US&page=1",
        numMovies: 4,
        checkout: 0,
        movies: [],
        moviesToPurchase: [],
        childTicket: [],
        adultTicket: [],
        ticketSub: [],
        numAdult: 0,
        numChild: 0,
        totals: {
            totalAdult: 0,
            totalChild: 0,
            total: 0
        },
        keyForRerender: 0
    },
    methods: {
        childPurchase(e)
        {
            var type = "child"
            this.filterMovies(e, type);
            this.calculateSub(type)
            this.numChild += 1;
            this.keyForRerender += 1;
            this.calculateTotal();
        },
        adultPurchase(e)
        {
            var type = "adult"
            this.filterMovies(e, type);
            this.calculateSub(type)
            this.numAdult += 1;
            this.keyForRerender += 1;
            this.calculateTotal();
        },
        checkOut()
        {
            if(this.moviesToPurchase.length > 0)
            {
                this.checkout = 0;
                this.checkout = 1;
                setTimeout(this.scroll, 25);
            }
        },
        scroll()
        {
            console.log('test')
            window.scrollTo(0, document.body.scrollHeight);
        },
        filterMovies(e, type)
        {
            var temp;
            this.moviesToPurchase.push(this.movies[e]);
            temp = [...new Set(this.moviesToPurchase)];
            this.moviesToPurchase = Array.from(temp);
            var index = this.moviesToPurchase.indexOf(this.movies[e]);            
            this.editTicketArrays(type, index);
        },
        editTicketArrays(type, index) {
            if(type == "adult")
            {
                this.adultTicket[index] += 1
                if(isNaN(this.adultTicket[index]))
                {
                    this.adultTicket[index] = 1;
                }
                
            }
            else if(type == "child")
            {
                this.childTicket[index] += 1
                if(isNaN(this.childTicket[index]))
                {
                    this.childTicket[index] = 1;
                }
            } 
        },
        removeAdult(e)
        {
            this.adultTicket[e] -= 1;
            this.numAdult -= 1;
            this.calculateSub();
            this.calculateTotal();
            if(this.adultTicket[e] <= 0)
            {
                this.adultTicket[e] = 0;
                if(this.adultTicket[e] == 0 && this.childTicket[e] == 0)
                {
                    this.moviesToPurchase.splice(e, 1);
                    this.childTicket.splice(e, 1);
                    this.adultTicket.splice(e, 1);
                    this.ticketSub.splice(e, 1);
                    
                    if(this.moviesToPurchase.length == 0)
                    {
                        this.checkout = 0;
                    }
                }
            }
            this.keyForRerender += 1;
        },
        removeChild(e)
        {
            this.childTicket[e] -= 1;
            this.numChild -= 1;
            this.calculateSub();
            this.calculateTotal();
            if(this.childTicket[e] <= 0)
            {
                this.childTicket[e] = 0;
                if(this.adultTicket[e] == 0 && this.childTicket[e] == 0)
                {
                    this.moviesToPurchase.splice(e, 1);
                    this.adultTicket.splice(e, 1);
                    this.childTicket.splice(e, 1);
                    this.ticketSub.splice(e, 1);

                    if(this.moviesToPurchase.length == 0)
                    {
                        this.checkout = 0;
                    }
                }
            }
            this.keyForRerender += 1;
        },
        removeMovie(e)
        {
            this.numAdult -= this.adultTicket[e];
            this.numChild -= this.childTicket[e];
            this.calculateTotal();
            this.moviesToPurchase.splice(e, 1);
            this.childTicket.splice(e, 1);
            this.adultTicket.splice(e, 1);
            this.ticketSub.splice(e, 1);

            if(this.moviesToPurchase.length == 0)
            {
                this.checkout = 0;
            }
        },
        calculateSub(type)
        {
            for(x = 0; x < this.moviesToPurchase.length; x++)
            {
                if(isNaN(this.childTicket[x]))
                {
                    this.childTicket[x] = 0;
                }
                if(isNaN(this.adultTicket[x]))
                {
                    this.adultTicket[x] = 0;
                }
                
                this.ticketSub[x] = ((this.childTicket[x] * 3.99) + (this.adultTicket[x] * 6.99)).toFixed(2);
            }
            this.keyForRerender += 1;
        },
        calculateTotal()
        {
            this.totals.totalAdult = (6.99 * this.numAdult).toFixed(2);
            this.totals.totalChild = (3.99 * this.numChild).toFixed(2);
            this.totals.total = (Number(this.totals.totalAdult) + Number(this.totals.totalChild)).toFixed(2);
        },
        moreMovies()
        {
            this.numMovies += 4;
            this.apiCall();
        },
        apiCall() {
            axios.get(this.url)
            .then((response) => 
            {
                this.movies = response.data.results.slice(0,this.numMovies)
            })
        }
    },
    mounted(){
        this.apiCall();
    }
})


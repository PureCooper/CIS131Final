Vue.component('movie', {
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
    </div>`,
    props: ["movieobj", "index", "nummovies"],
    methods: {
        childpurchase()
        {
            this.$emit('child', this.index)
        },
        adultpurchase()
        {
            this.$emit('adult', this.index);
        },
        checkout()
        {
            this.$emit('check')
        }
    }
})

Vue.component('badge', {
    template: `
        <button @click="removeTicket" class=" btn btn-sm btn-dark btn-outline-light" type="submit">Remove Ticket</button>`,
    props: ["index"],
    methods: {
        removeTicket(){
            this.$emit('remove', this.index);
        }
    }
})

Vue.component('tablerow', {
    template: `
    <tr>
        <th scope="row" style="width: 25%">{{movie.title}}</th>
        <td style="width: 25%">
            <div v-show="adult > 0" class="row">
                <div class="col-4">
                    {{adult}} x $6.99
                </div>
                <div class="col-6">
                    <badge :index="index" @remove="removeAdult($event)"></badge>                                        </a>
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
    </tr>`,
    props: ["movie", "adult", "child", "index", "sub"],
    methods: {
        removeAdult(e){
            this.$emit('removeadult', e)
        },
        removeChild(e){
            this.$emit('removechild', e)
        },
        removeMovie(){
            this.$emit('removemovie', this.index)
        }
    }
})

Vue.component('checkout', {
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
    </table>`,
    props: ['movies', 'checkout', 'adult', 'child', 'sub', 'totals'],
    methods: {
        removeAdult(e){
            this.$emit('removeadult', e)
        },
        removeChild(e){
            this.$emit('removechild', e)
        },
        removeMovie(e){
            this.$emit('removemovie', e)
        }
    }
})

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

            this.checkout = 0;
            this.checkout = 1;
            setTimeout(this.scroll, 25);
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
            this.calculateSub()
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
                }
            }
            this.keyForRerender += 1;
        },
        removeMovie(e)
        {
            this.moviesToPurchase.splice(e, 1);
            this.childTicket.splice(e, 1);
            this.adultTicket.splice(e, 1);
            this.ticketSub.splice(e, 1);
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


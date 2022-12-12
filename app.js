//Name: Cooper Brown
//Date: 12/8/2022
//Class: CIS-131

//word wrap recommended!

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
        removeTicket()
        {
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
        removeAdult(e)//and finally it takes in the array that holds the subtotals for each of the movies that are being displayed in our shopping cart
        {
            this.$emit('removeadult', e);//the remove adult function which sends an emitter to the parent component <checkout> containing the index that was
        },                               //sent up from  <badge> component in order to remove an adult ticket
        removeChild(e)
        { 
            this.$emit('removechild', e); //the remove child function which sends an emitter to the parent component <checkout> containing the index that was
        },                             //sent up from  <badge> component in order to remove a child ticket
        removeMovie(){
            this.$emit('removemovie', this.index); //the remove movie function sends an emitter containing the index of this tablerow's movie to the parent component
        } //in order to remove it from the main array
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
        removeAdult(e)//additionally the adult and child ticket arrays are sent in to further send down into the child components
        {            //lastly, the subtotals/total are sent down to display within the table footer
            this.$emit('removeadult', e); 
        },         //the indexes for both the child and adult tickets are still being sent up the ladder of components but this is the last stop 
        removeChild(e) //before the DOM, the next distination for 'e' or 'index' will be vue instance where we can use it in functions
        { 
            this.$emit('removechild', e); 
        }, 
        removeMovie(e)
        { //just like the adult and child emitters, this will be the last stop for the index of the movie that the user wishes to remove 
            this.$emit('removemovie', e); //all of these index's have been sent up the nested components
        }
    }
})

const app = new Vue({ //Declaration of the vue instance 
    el: "#app", 
    data: {
        url: "https://api.themoviedb.org/3/movie/now_playing?api_key=b7c82d15e3cce1e75e9457dd5478dfc2&language=en-US&page=1", //the url that is used to make the api call
        numMovies: 4, //number of movies that will be loaded onto the page at render, directly tied to more
        more: 4, //a variable that is used to increase the amount of movies rendered on the page
        checkout: 0, //the variable responsible for if the shopping cart displays, this is done using v-show
        movies: [], //the original movie object array that holds a 'numMovies' amount of movies
        moviesToPurchase: [], //the array that holds the movie objects that our user is purchasing. It is filtered for duplicates
        adultTicket: [], //another parallel array that is identical to the previous array other than that it holds the numbers for adult tickets
        childTicket: [], //parallel array to our moviesToPurchase array that holds the amount of child tickets for each index corresponding to a movie 
        ticketSub: [], //yet another parallel array that holds the subtotal amounts for each movie corresponding to the index in the master 'moviesToPurchase' array
        numAdult: 0, //the total number of adult tickets for the order
        numChild: 0, //the total number of child tickets 
        totals: { //an object containing all of the information we will send into our table footer
            totalAdult: 0, //the total price for all of the adult tickets
            totalChild: 0, //the total price for the child tickets
            total: 0 //the total price
        },
        keyForRerender: 0 //variable that gets assigned as a key in several locations, the reason for this is to force a rerender of whatever component this key is tied to
    },            //i was having trouble having certain information display as soon as it was changed and so i found this solution on github
    methods: {
        adultPurchase(e) //method used to purchase an adults's ticket, takes the index we sent up through the components using emitters as a parameter
        {
            var type = "adult" //sets a scoped variable of type to adult
            this.filterMovies(e, type); //sends the index and the type of the ticket purchased into a the filterMovies function
            this.calculateSub(type) //sends the type of ticket into the calculateSub function
            this.numAdult += 1; //ticks up numAdult by 1 
            this.keyForRerender += 1; //force rerender
            this.calculateTotal(); //calculates the totals 
        },
        childPurchase(e) //method used to purchase a child's ticket, takes the index we sent up through the components using emitters as a parameter
        {
            var type = "child" //sets a scoped variable of type to child
            this.filterMovies(e, type); //sends the index and the type of the ticket purchased into a the filterMovies function
            this.calculateSub(type) //sends the type of ticket into the calculateSub function
            this.numChild += 1; //ticks up numChild by 1
            this.keyForRerender += 1; //forces a rerender
            this.calculateTotal(); //calculates the totals that will be displayed in the table footer
        },
        filterMovies(e, type)  //the method used to filter the moviesToPurchase array
        {
            var temp; //creates a temporary variable 
            this.moviesToPurchase.push(this.movies[e]); //pushes the movie that the user is getting a ticket for to the moviesToPurchase using the index parameter
            temp = [...new Set(this.moviesToPurchase)]; //creates a set of that array, this is to get rid of duplicates. Found on stackoverflow as an easy way to go about it
            this.moviesToPurchase = Array.from(temp); //turns that set we just created back into an array 
            var index = this.moviesToPurchase.indexOf(this.movies[e]); //creates a variable 'index' and assigns it the index of the purchased movie within the moviesToPurchase array
            this.editTicketArrays(type, index); //sends that new index as well as the type of ticket being bought to the editTicketArrays function
        },
        editTicketArrays(type, index) { //method responsible editing the parallel arrays that hold the ticket numbers for each movie
            if(type == "adult") //if it is an adult ticket
            {
                this.adultTicket[index] += 1; //adds 1 to the adultTicket index corresponding to the movie that was chose
                if(isNaN(this.adultTicket[index])) //if the amount of tickets is not a number due to using array.splice
                {
                    this.adultTicket[index] = 1; //that index now equals 1, this is so that if the array is empty it will still continue adding tickets
                }
                
            }
            else if(type == "child") //if it is a child ticket
            {
                this.childTicket[index] += 1; //adds 1 to the childTicket index corresponding to the movie that was chose
                if(isNaN(this.childTicket[index])) //if the amount of tickets is not a number due to using array.splice
                {
                    this.childTicket[index] = 1; //that index now equals 1, this is so that if the array is empty it will still continue adding tickets
                }
            } 
        },
        removeAdult(e) //method responsible for removing an adult ticket
        {
            this.adultTicket[e] -= 1; //subtracts 1 from the parallel array 
            this.numAdult -= 1; //subtracts 1 from the total of adult tickets
            this.calculateSub(); //calculates the subtotals
            this.calculateTotal(); //calculates the totals
            if(this.adultTicket[e] <= 0) //if the number of adult tickets for that index is less than or equal to 0
            {
                this.adultTicket[e] = 0; //make the number of tickets 0, this is to avoid negative amounts of movie tickets
                if(this.adultTicket[e] == 0 && this.childTicket[e] == 0) //if both the child and adult tickets for that index are 0
                {
                    this.splice(e); //calls the splice method with the index parameter
                }
            }
            this.keyForRerender += 1; //forces a rerender just in case
        },
        removeChild(e) //method responsible for removing a child ticket
        {
            this.childTicket[e] -= 1; //takes away one child ticket for the index provided
            this.numChild -= 1; //takes away one child ticket from the total of child tickets
            this.calculateSub(); //calculates the subtotals
            this.calculateTotal(); //calculates the totals
            if(this.childTicket[e] <= 0) //if the number of child tickets for that index is less than or equal to 0
            {
                this.childTicket[e] = 0; //sets this index's number of child tickets to 0
                if(this.adultTicket[e] == 0 && this.childTicket[e] == 0) //
                {
                    this.splice(e); //calls the splice method
                }
            }
            this.keyForRerender += 1; //forces a rerender
        },
        removeMovie(e) //method used to remove a movie as a whole from the moviesToPurchase array, thus removing it visually
        {
            this.numAdult -= this.adultTicket[e]; //deletes all of the tickets for this index from the total number of adult tickets
            this.numChild -= this.childTicket[e]; //^^ does the same thing except for child tickets
            this.calculateTotal(); //recalculates the total so that it displays correctly in the shopping cart table
            this.splice(e); //calls the splice method
        },
        splice(e)
        {
            this.moviesToPurchase.splice(e, 1); //removes that movie from the main array
            this.childTicket.splice(e, 1); //removes that index of child tickets
            this.adultTicket.splice(e, 1); //removes that index of adult tickets
            this.ticketSub.splice(e, 1); //and finally removes that index of subtotals
            //splice is used in order to keep the order correct within the master array so that users can add and remove movies without data getting switched
            if(this.moviesToPurchase.length == 0) //if there are no movies in the main array
            {
                this.checkout = 0; //the checkout menu goes away
            }
        },
        calculateSub(type) //method used for calculating the subtotals for both child and adult tickets. Takes in the ticket type as a parameter
        {
            for(x = 0; x < this.moviesToPurchase.length; x++) //for the length of moviesToPurchase
            {
                if(isNaN(this.childTicket[x])) //if this index's number of tickets is Not a Number
                {
                    this.childTicket[x] = 0; //change that index's value to 0
                }
                if(isNaN(this.adultTicket[x])) //if this index's number of tickets is Not a Number
                {
                    this.adultTicket[x] = 0; //change that index's value to 0
                }
                
                this.ticketSub[x] = ((this.childTicket[x] * 3.99) + (this.adultTicket[x] * 6.99)).toFixed(2); //the subtotal is then calculated
            } //the math involved is just taking each of the tickets multiplied by their respective price and then adding them. Rounding to 2 decimal places of course
            this.keyForRerender += 1; //force rerender
        },
        calculateTotal() //method used to calculate the totals that will be displayed in the table footer
        {
            this.totals.totalAdult = (6.99 * this.numAdult).toFixed(2); //multiplies the number of adult tickets by 6.99 then rounds to 2 decimal places
            this.totals.totalChild = (3.99 * this.numChild).toFixed(2); //multiplies the number of child tickets by 3.99 then rounds to 2 decimal places
            this.totals.total = (Number(this.totals.totalAdult) + Number(this.totals.totalChild)).toFixed(2); //to calculate the grand total the two numbers are added
        }, //Number() is used because of a bug that wasnt recognizing totalAdult and totalChild as numbers
        checkOut() //the method used to change the variable that is used to display the shopping cart table
        {
            if(this.moviesToPurchase.length > 0) //if there are movies in the moviesToPurchase array 
            {
                this.checkout = 0; //then the checkout will display
                this.checkout = 1; //the value is changed from 0 to 1 as another failsafe forced rerender
                setTimeout(this.scroll, 25); //after 25 milliseconds the scroll method is called
            }
        },
        scroll() //the method responsible for scrolling the users screen down
        {
            window.scrollTo(0, document.body.scrollHeight); //scrolls the very bottom of the scroll height
        },
        moreMovies() //method used to display more movies
        { 
            this.numMovies += this.more; //the amount of movies being rendered is incrimented by the more variable which should be changed along with numMovies
            this.apiCall(); //the api is called again in order to refresh how many movies we are holding in our movies array
        },
        apiCall() //method used to call our api
        { 
            axios.get(this.url) //uses the url variable in the axios get request
            .then((response) => //the response is then taken into an anonymous function
            {
                this.movies = response.data.results.slice(0,this.numMovies); //where the 'movies' array will be filled with an amount of movies specified in our numMovies variable
            })
        }
    },
    mounted() //upon page render
    {
        this.apiCall(); //the api will get called
    }
})


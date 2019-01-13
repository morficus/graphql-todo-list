# GraphQL To-Do List

Playing around with GraphQL for fun and profit.  
I followed [this tutorial](https://www.howtographql.com/graphql-js/0-introduction/) for the most part but quickly deviated to explore slightly more advanced concepts.

## How to run locally
1. Clone the repo
2. run `npm install`
3. run `npm start`

At this point the API up and running at `http://localhost:4000/`.  
If you open this URL in a browser you will see the GraphQL explorer, which will allow you to explore the current Schema.  

## Samples
Some sample queries can be found here: [https://graphqlbin.com/v2/jZzJUj](https://graphqlbin.com/v2/jZzJUj).  
If the local server is running, you can just run those queries and they will actually work.


## Other notes
There is no real DB behind this. The initial data is loaded from flat-files located in the `data` directory.  
All future data and operations are only held in memory. So if you stop the app and start again... any new data will be gone.  



Happy hacking!

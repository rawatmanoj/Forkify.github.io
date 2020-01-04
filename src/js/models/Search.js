import axios from 'axios';


export default class Search{
    constructor(query){

        this.query=query;

    }

    async getResults(){
        const key='021231aa8cb1f3d7adb336737366340b';
       const appId='f7ecae18';
        const example=`https://api.edamam.com/search?q=${this.query}&app_id=${appId}&app_key=${key}`;
         
        try{
            const res=await axios(example);
            this.result= res.data.hits;
           // console.log(this.result);
           // console.log(res);
           }catch(error){
              console.log(error);
           }
    }
}

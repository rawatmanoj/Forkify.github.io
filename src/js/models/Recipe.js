import axios from 'axios';
import {key,appId,uri} from '../config'




export default class Recipe{

constructor(id){
   this.id=uri;
}

async getRecipe(){

    
    const example=`https://api.edamam.com/search?r=${this.id}&app_id=${appId}&app_key=${key}`;
           
            try{
               
                const res=await axios(example);
                this.title=res.data[0].label;
                this.author="The Pioneer Woman";
                this.image=res.data[0].image;
                this.url=res.data[0].url;
                this.ingredients=res.data[0].ingredientLines;
                //this.ingredient=res.data[0].ingredientLines;


                //console.log(this.ingredient.length);
                
               // console.log(res);

            }catch(error){
                console.log(error);
                alert('something went wrong');
            }
        }

       calcTime(){

          const numIng=this.ingredients.length;
          const periods=Math.ceil(numIng/3);
          this.time=periods*15;

       }

       calcServings(){

           this.servings=4;

       }

    parseIngredients(){

        const unitsLong=['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds','kg']
        const unitsShort=['tbspn','tbspn','oz','oz','tsp','tsp','cup','pound','Kilograms']
        
        const units=[...unitsShort,'g']

        const newIngredients=this.ingredients.map(el=>{

        let ingredient=el.toLowerCase();

        unitsLong.forEach((unit,i)=>{
            
           ingredient=ingredient.replace(unit,unitsShort[i]);

        });

        ingredient=ingredient.replace(/[\];)}[{(-]/g, ' ');
        ingredient=ingredient.replace(/\s{2,}/g, ' ');
        //console.log(ingredient);

        const arrIng=ingredient.split(' ');
        //console.log(arrIng);
        const unitIndex=arrIng.findIndex(el2 => units.includes(el2));
        // console.log(unitIndex);
        let objIng;
        if(unitIndex >-1){

             const arrCount=arrIng.slice(0,unitIndex);

             let count;

             if(arrCount.length === 1){
                count=arrIng[0];
             }else{
             count=eval(arrIng.slice(0,unitIndex).join('+'));
              //console.log(count);
             }

             objIng={
                count,
                unit:arrIng[unitIndex],
                ingredient: arrIng.slice(unitIndex+1).join(' ')
            }

        }else if(parseInt(arrIng[0],10)){

            objIng={
                count:parseInt(arrIng[0],10),
                unit:'',
                ingredient: arrIng.slice(1).join(' ')
            }
        
        }else if(unitIndex===-1){
            objIng={
                count:1,
                unit:'',
                ingredient
            }
        }

        return objIng;

        });
        this.ingredients=newIngredients;
    }
       
    updateServings(type){
       const newServings=(type==='dec')?this.servings-1:this.servings+1;
       this.ingredients.forEach(ing=>{
           ing.count*=(newServings/this.servings);
       });

       this.servings=newServings;
    }

}

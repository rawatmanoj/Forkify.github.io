import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import List from './models/List';
import { elements,renderLoader,clearLoader } from './views/base';
import Recipe from './models/Recipe';
import {uri} from './config';
const state={};

window.state=state;

const controlSearch=async ()=>{

const query=searchView.getInput();
//console.log(query);

if(query){

state.search=new Search(query);

//3prepare Ui
searchView.clearInput();
searchView.clearResults();
renderLoader(elements.searchRes);
//4search for recipes
await state.search.getResults();
//console.log(state.search.result);

//5Render results on UI
clearLoader();
searchView.renderResults(state.search.result);
//console.log(state.search.result);

}

}

elements.searchForm.addEventListener('click',e=>{

e.preventDefault();
controlSearch();

});

elements.searchResPages.addEventListener('click',e=>{
    const btn = e.target.closest('.btn-inline');
    //console.log(e.target);
    if(btn){
       
          const goToPage=parseInt(btn.dataset.goto,10);
          searchView.clearResults();
          searchView.renderResults(state.search.result,goToPage);
          console.log(goToPage);
    }
});

//Recipe controller
//console.log(state.search.result);


const controlRecipe= async ()=>{
    const id=window.location.hash.replace('#','');
   // console.log(id);

    if(id){

        recipeView.clearRecipe();

        renderLoader(elements.recipe);

        if(state.search)searchView.highlighSelected(id);

        state.recipe=new Recipe(id);

       // console.log(state.recipe);
       //Testing
       

       try{

        await state.recipe.getRecipe();
        state.recipe.parseIngredients();
       // console.log(state.recipe.ingredients);

        state.recipe.calcTime();

        state.recipe.calcServings();

       // console.log(state.recipe);

       clearLoader();

       recipeView.renderRecipe(state.recipe);

       }catch(error){

            console.log(error);
           //alert("error processing recipe");

       }
          
    }

}

// window.addEventListener('hashchange',controlRecipe);
// window.addEventListener('load',controlRecipe);

['hashchange','load'].forEach(event=>window.addEventListener(event,controlRecipe));

//List controller

const controlList = ()=>{

    

   if(!state.list) state.list = new List();

   state.recipe.ingredients.forEach(el=>{

      const item=state.list.addItem(el.count,el.unit,el.ingredient);
console.log(item);
         listView.renderItem(item);
   });


}

elements.shopping.addEventListener('click',e=>{
    const id=e.target.closest('.shopping__item').dataset.itemid;

    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        state.list.deleteItem(id);
        listView.deleteItem(id);
 
 
    }else if(e.target.matches('.shopping__count-value')){
           const val=parseFloat(e.target.value,10);
           state.list.updateCount(id,val);
    }

});


//handling recipe button clicks 
elements.recipe.addEventListener('click',e=>{

    //console.log(state.recipe.ingredients);

    if(e.target.matches('.btn-decrease,.btn-decrease *')){
        if(state.recipe.servings>1){
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngrediants(state.recipe);
      
    }
}else if(e.target.matches('.btn-increase,.btn-increase *')){
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngrediants(state.recipe);
    }else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
       
        controlList();

    }
   // console.log(state.recipe);
});



window.l=new List();
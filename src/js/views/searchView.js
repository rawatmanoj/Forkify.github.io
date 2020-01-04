import {elements} from './base';
import {uri} from '../config';

export const getInput=()=>{

return elements.searchInput.value;

}

export const clearInput=()=>{

    elements.searchInput.value='';

};

export const clearResults=()=>{
    elements.searchResList.innerHTML='';
    elements.searchResPages.innerHTML='';
}

export const highlighSelected = id =>{

     const resultArr = Array.from(document.querySelectorAll('.results__link'));

     resultArr.forEach(el=>{
         el.classList.remove('results__link--active');
     });

     document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');

};

export const limitRecipeTitle=(title,limit=24)=>{

const newTitle=[];

if(title.length>limit){
  title.split(' ').reduce((acc,cur)=>{
      if(acc+cur.length<=limit){
         newTitle.push(cur);
      }
      return acc + cur.length;
  },0);

  return `${newTitle.join(' ')}...`;
}

return title;

}

const renderRecipe= recipe => {

const markup=`

            <li>
            <a class="results__link" href="#${recipe.recipe.uri}">
                <figure class="results__fig">
                    <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.recipe.label)}</h4>
                    <p class="results__author">The Pioneer Woman</p>
                </div>
            </a>
            </li>                   
            
        `;

elements.searchResList.insertAdjacentHTML('beforeend',markup);

};

const createButton=(page,type)=>`

    <button class="btn-inline results__btn--${type}" data-goto=${(type==='prev')?page-1:page+1}>
    <span>Page ${(type==='prev')?page-1:page+1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${  (type==='prev')?'left':'right'}"></use>
        </svg>
    </button>           
`;

      

const renderButtons=(page,numResults,resPerPage)=>{
    const pages=Math.ceil(numResults/resPerPage);

    let button;
    if(page===1 && pages>1){

        button=createButton(page,'next');


    }else if(page<pages){

        button=`
        ${createButton(page,'prev')}
        ${createButton(page,'next')}
        `;

       
    }else if(page===pages && pages>1){

        button=createButton(page,'prev');

    }

   
   
    
    elements.searchResPages.insertAdjacentHTML('afterbegin',button);

};

export const renderResults = (hits,page=1,resPerPage=7)=>{
   // [hits].foreach(renderRecipe);
  // Array.prototype.forEach.call(hits,renderRecipe);

  const start = (page-1)*resPerPage;
  const end = page*resPerPage;

      Array.from(hits).slice(start,end).forEach(renderRecipe);

       

      renderButtons(page,hits.length,resPerPage);

};
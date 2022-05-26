import type { State, Action } from '~/types';

const updateBoard = (state:State, action:Action) : State => {
    switch(action.type){
      case 'loading':
        return {...state};
      case 'foundPlayer':
        state.player = action.player;
        state.displayPlayer = action.display;
        return {...state};
      case "loadBoard":
        for(let index in action.boardDirective){
          const DIRECTIVE = action.boardDirective[index];
          if(DIRECTIVE === "init"){
          }
        }
        return {...state};
      case "castMoves":
        state.moveBubbles = action.bubbles;
        console.log(state);
        return {...state};
      case "refresh":
        state.moveBubbles = null;
        return {...state};
      case 'error':
        state.displayPlayer = "An error has occured please refresh the page";
        return {...state};
      default:
        return {...state};
    }
  }

export default updateBoard;
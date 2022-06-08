import type { SocketState, SocketAction } from '~/types';

const SocketUpdates = (state:SocketState, action:SocketAction) : SocketState => {
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
        return {...state};
      case "refresh":
        return {...state};
      case 'error':
        state.displayPlayer = "An error has occured please refresh the page";
        return {...state};
      default:
        return {...state};
    }
  }

export default SocketUpdates;
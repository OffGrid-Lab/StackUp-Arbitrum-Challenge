

import * as dotenv from "dotenv";

dotenv.config();

// const REDIS_KEY = process.env.REDIS_KEY!
// console.log(REDIS_KEY, "REDDIS KEY")
// export const client = new Redis(`rediss://default:${REDIS_KEY}@frank-yeti-32709.upstash.io:6379`);
class StateManager {
    private allStates: Record<string, string[]> = {};
  
    addState(sessionId: string, newState: string): void {
      if (!this.allStates[sessionId]) {
        this.allStates[sessionId] = [];
      }
      this.allStates[sessionId].push(newState);
    }
  
    clearStates(sessionId: string): void {
      delete this.allStates[sessionId];
    }
  
    getStates(sessionId: string): string[] | undefined {
      return this.allStates[sessionId];
    }
  
    joinStates(sessionId: string, separator: string): string | undefined {
      const states = this.allStates[sessionId];
      if (states) {
        return states.join(separator);
      }
      return undefined;
    }
  }
  

  export const stateInstance = new StateManager()
  export default StateManager;

  
  
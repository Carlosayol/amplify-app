import Amplify from 'aws-amplify';
import awsConfig from './aws-exports';
import React, { useState, useEffect } from 'react';
import './App.css';
import { API, graphqlOperation } from 'aws-amplify';
import {getGames} from './graphql/queries';
import {addGame, deleteGame} from './graphql/mutations';


Amplify.configure(awsConfig);

const initialDataState = {id: '', name: '', genre: ''}

function App() {
  const [gameData, setGameData] = useState([])
  const [formData, setFormData] = useState(initialDataState)

  useEffect(() => {
    fetchGames();
  }, [gameData]);

  async function fetchGames() {
    const apiData = await API.graphql(graphqlOperation(getGames))

    const tempData=apiData.data.getGames.sort((a1,b1) =>{

      if (a1.id > b1.id) {
        return 1;
      }
      if (a1.id < b1.id) {
        return -1;
      }
      return 0;
    })
    setGameData(tempData)
  }

  async function createGame(){
    if (!formData.id || !formData.name || !formData.genre) return;
    await API.graphql({query: addGame, variables: formData });
    const curGames = gameData.filter(game => game.id !== formData.id)
    setGameData([...curGames, formData])
    setFormData(initialDataState)
  }

  async function delGame({id}){
    const curGames = gameData.filter(game => game.id !== id)
    setGameData(curGames)
    await API.graphql({query: deleteGame, variables: {id: id} });
  }

  return (
    <div className="App">
      <h1>Games</h1>
      <input
        onChange={e => setFormData({ ...formData, 'id': e.target.value})}
        placeholder="Game id"
        value={formData.id}
      />
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Game name"
        value={formData.name}
      />
      <input
        onChange={e => setFormData({ ...formData, 'genre': e.target.value})}
        placeholder="Game genre"
        value={formData.genre}
      />

      <button onClick={createGame}>Add Game</button>
      <div style={{marginBottom: 30}}>

        {
          gameData.map((game) => (
            <div key={game.id}>
              <h2>{game.id}</h2>
              <h2>{game.name}</h2>
              <p>{game.genre}</p>
              <button onClick={() => delGame(game)}>Delete Game</button>
            </div>
          ))
        }
      </div>

    </div>
  );

}

export default App;

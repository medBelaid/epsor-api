import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { flatten, orderBy, filter, isEmpty } from 'lodash';
import Select, { components } from 'react-select';
import loadingIcon from './Loading_icon.gif';
import './App.css';

const Title = styled.div`
  flex: 1;
  padding: 1em;
  font-size: 1.1em;
  font-weight: bold;
  text-align: center;
  a {
    color: palevioletred;
    text-decoration: none;
  }
`;

// Create a <Wrapper> react component that renders a <section> with
// some padding and a papayawhip background
const Wrapper = styled.section`
  padding: 1em 0;
  background: papayawhip;
  ul {
    list-style-type: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    li {
      display: inline-flex;
      flex: 1 1 30%;
      max-height: 300px;
      flex-direction: row;
      margin: 1em;
      background: white;
      margin-bottom: 20px;
      box-shadow: 5px 5px 2px 1px rgba(0, 0, 0, .2);
      img {
        border-right: 2px solid rgba(0, 0, 0, .2);
        width: 100%;
        height: 300px;
      }
      @media only screen and (max-device-width:500px) {
        flex: 1 1 90%;
      }
    }
  }
`;

const Poster = styled.div`
flex: 1;
text-align: left;
`;

const Filter = styled.div`
display: inline-flex;
flex-direction: row;
text-align: center;
min-width: 70%;
@media only screen and (max-device-width:500px) {
  width: 100%;
  flex-direction: column;
}
.select {
  margin: 0 20px;
  flex: 1;
}
`;

const Note = styled.div``;
const ReleaseDate = styled.div`
font-weight: normal;
font-size: 0.6em;
`;

const OrderByOptions = [
  { value: 'desc', label: 'Note : par ordre croissant' },
  { value: 'asc', label: 'Note : par ordre décroissant' },
];

function App(props) {
  console.log(props);
  const [movies, setMovies] = useState([]);
  const [initMovies, setInitMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actors, setActors] = useState([]);
  useEffect(async () => {
    try {
      let moviesData = await Promise.all([1, 3, 5, 7, 9, 10, 11, 12, 13, 19].map(actorId => {
        return axios(`https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=6bddf72f0589eec599cb1105bb86c8a5`)
        .then(response => {
          const movies = response.data.cast.map(movie => {
            return {
              ...movie,
              actorId: response.data.id,
            }
          });
          return movies;
        });
      }));
      setLoading(false);
      moviesData = flatten(moviesData);
      moviesData = orderBy(moviesData, ['vote_average'], ['desc']);
      setMovies(moviesData);
      setInitMovies(moviesData);
  } catch (error) {
      throw error;
  } finally {
    setLoading(false);
  }

  try {
    let actors = await Promise.all([1, 3, 5, 7, 9, 10, 11, 12, 13, 19].map(actorId => {
      return axios(`https://api.themoviedb.org/3/person/${actorId}?api_key=6bddf72f0589eec599cb1105bb86c8a5`)
      .then(response => {
        return {
          value: actorId,
          label: response.data.name,
        }
      });
    }));
    setActors(actors);
} catch (error) {
    throw error;
}

  }, []);

  const handleChange = (event) => {
    const order = event.value === 'desc' ? 'asc' : 'desc';
    setMovies(orderBy(movies, ['vote_average'], [order]));
  }

  const handleChangeActor = (event) => {
    if (isEmpty(event)) {
      setMovies(initMovies);
    } else {
      const actorIds = event.map(ev => ev.value);
      const isIncludedMovie = (id) => actorIds.includes(id);
      const moviesFiltered = filter(initMovies, (movie) => {return isIncludedMovie(movie.actorId) });
      setMovies(moviesFiltered);
    }
  }
  return (
    <div className="App">
      {
          loading ? <img src={loadingIcon} /> :
          <Wrapper>
            <Filter>
              <Select
                options = {OrderByOptions} onChange={(event) => handleChange(event)}
                defaultValue={OrderByOptions[1]}
                className="select"
              />
              <Select
                options = {actors}
                onChange={(event) => handleChangeActor(event)}
                isMulti
                className="select"
                closeMenuOnSelect={false}
              />
            </Filter>
            <ul>
            {movies && movies.map((item, index) => (
              <li key={index}>
                <Poster><img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} /></Poster>
                <Title>
                  <a
                    href={`/movies/${item.id}`}
                  >
                    {item.title}
                  </a>
                  <Note>{item.vote_average} / 10</Note>
                  {item.release_date && <ReleaseDate>année de sortie: {item.release_date}</ReleaseDate>}
                </Title>
              </li>
              ))}
            </ul>
          </Wrapper>
        }
    </div>
  );
}

export default App;

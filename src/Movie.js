/* eslint-disable linebreak-style */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Movie(props) {
    const [movie, setMovie] = useState({});
    useEffect(async () => {
        try {
            const result = await axios(`https://api.themoviedb.org/3/movie/${window.location.pathname.split('/')[2]}?api_key=6bddf72f0589eec599cb1105bb86c8a5`);
            setMovie(result.data);
        }
        catch(error) {

        }
    }, {});
    return (
        <div>
            <h1>{movie.title}</h1>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} />
        </div>
    );
}

export default Movie;

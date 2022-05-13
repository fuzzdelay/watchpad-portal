import axios from 'axios'
import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import '../components/Media.css'
import CommentBox from '../components/CommentBox'
import LikeDislikes from '../components/LikeDislikes'
import DurationBar from '../components/DurationBar'
import '../css/Buttons.css'
import AddWatchlist from '../components/AddWatchlist'

const base_url = 'https://image.tmdb.org/t/p/original/'
function MediaPage() {
    let params = useParams()
    const [runtime, setRuntime] = useState(0)

    /*
    async function fetchData() {
    let fetchUrl = `https://api.themoviedb.org/3/movie/${params.movieId}?${process.env.REACT_APP_APIKEY}=&language=en-US`
    console.log(fetchUrl)
    const data = await axios.get(fetchUrl)
    console.log(data);

    var obj = data.parseJSON('{"title": ""}');
    return data

    }
    */
    const [movie, setMovie] = useState('WAITING FOR DATA')
    const getMovieInfo = async () => {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${params.movieId}?api_key=${process.env.REACT_APP_APIKEY}&language=en-US`
        )
        const data = await response.json()
        setMovie(data)
        console.log(movie)
        console.log(data)
        setRuntime(data.runtime)
        return data
    }

    useEffect(() => {
        getMovieInfo()
    }, [])

    return (
        <>
            <div>
                <h1 className="inline-block">
                    {movie.title} <AddWatchlist />
                </h1>
            </div>

            <LikeDislikes likeCount={0} dislikeCount={0} />
            <img
                key={movie.id}
                className="media_poster"
                src={`${base_url}${movie.poster_path}`}
                alt={movie.title}
            />

            <h2> Id: {params.movieId} </h2>
            <h3> {movie.overview} </h3>
            <DurationBar runtime={runtime} />
            <CommentBox />
        </>
    )
}

export default MediaPage

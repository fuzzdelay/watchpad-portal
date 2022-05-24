import axios from 'axios'
import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import '../components/Media.css'
import CommentBox from '../components/CommentBox'
import LikeDislikes from '../components/LikeDislikes'
import DurationBar from '../components/DurationBar'
import CommentDisplay from '../components/CommentDisplay'
import '../css/Buttons.css'
import '../css/Comments.css'
import AddWatchlist from '../components/AddWatchlist'
import DurationComments from '../components/DurationComments'
import { Layout, Image, Row, Col, Space, Typography } from 'antd'
import logo from '../static/watchpad_logo.png'
import FiveStarMediaRating from '../components/FiveStarMediaRating'

const base_url = 'https://image.tmdb.org/t/p/original/'
function MediaPage() {
    // const userInformation = useSelector((store) => store.userInformation)

    let params = useParams()
    const [runtime, setRuntime] = useState(0)
    const { Sider, Content } = Layout
    const { Title, Paragraph } = Typography

    // const[likesTotal, setLikesTotal] = useState(0)
    // const[dislikesTotal, setDislikesTotal] = useState(0)

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

    const saveMedia = async () => {
        const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/api/media/save-media`,
            {
                id: params.movieId,
            }
        )
        console.log(response)
    }

    useEffect(() => {
        saveMedia()
        getMovieInfo()
    }, [])

    return (
        <Layout>
            <Sider width={375} style={{ padding: '10px 10px' }}>
                <Space direction="vertical" size="small">
                    <Image
                        key={movie.id}
                        src={`${base_url}${movie.poster_path}`}
                        alt={movie.title}
                        rightMargin="10px"
                        fallback={logo}
                    />

                    <Row wrap={false} align="middle">
                        <Col span={8}>
                            <LikeDislikes />
                        </Col>
                        <Col span={16}>
                            <FiveStarMediaRating />
                        </Col>
                    </Row>
                    <Row>
                        <AddWatchlist />
                    </Row>
                </Space>
            </Sider>

            <Content style={{ padding: '0 10px' }}>
                <Title>
                    {movie.title} :
                    <small class="text-muted"> {params.movieId}</small>
                </Title>
                <Paragraph>{movie.overview}</Paragraph>
                <CommentBox mediaId={movie.id} />

                <div className="comment_display">
                    <CommentDisplay />
                </div>

                <DurationBar runtime={runtime} />
                <DurationComments mediaId={movie.id} />
            </Content>
        </Layout>
    )
}

export default MediaPage

import React, { createElement, useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import 'antd/dist/antd.css'
import { useDispatch, useSelector } from 'react-redux'
import { setDurationComments } from '../redux/reducers/duration/durationSlice'
import {
    setRealTimeComments,
    myAddRealTimeComment,
} from '../redux/reducers/duration/realTimeSlice'
import LikeDislikeComment from './LikeDislikeComment'
import { Switch } from 'antd'

import { Comment, Tooltip, List } from 'antd'
import moment from 'moment'
import {
    DislikeOutlined,
    LikeOutlined,
    DislikeFilled,
    LikeFilled,
} from '@ant-design/icons'

const DurationComments = (currentPosition) => {
    let params = useParams()
    const [currentComment, setCurrentComment] = useState(null)
    const [isStackEmpty, setisStackEmpty] = useState(true)
    const [isCurrentComment, setisCurrentComment] = useState(false)
    const [doneInitializing, setDoneInitializing] = useState(false)
    const durationComments = useSelector((store) => store.durationComments)
    const realTimeComments = useSelector((store) => store.realTimeComments)
    const [commentStack, setCommentStack] = useState([])
    var newArray = []
    var currComment = null

    const dispatch = useDispatch()

    const getComments = async (event) => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/api/comments/get-duration-comments-by-media-sorted?mediaId=${params.movieId}`
            )
            dispatch(setDurationComments(response.data))

            console.log('SHOULD BE RETURN', response.data)

            dispatch(setRealTimeComments([]))
        } catch (e) {
            console.log('error', e)
        }
    }

    const initializeCommentStack = () => {
        durationComments.map((c) => commentStack.push(c))
        setisStackEmpty(false)
        setDoneInitializing(true)
        console.log('initialized commentStack', commentStack)
    }

    useEffect(() => {
        getComments()
    }, [])

    //creates new commentStack from durationComments
    useEffect(() => {
        if (isStackEmpty && !doneInitializing) {
            initializeCommentStack()
        }
    }, [isStackEmpty, currentPosition, isCurrentComment])

    //sets current comment by popping last one off the stack (has the lowest duration time)
    useEffect(() => {
        if (!isStackEmpty && doneInitializing) {
            if (!isCurrentComment && commentStack.length > 0) {
                setCurrentComment(commentStack.pop())
                console.log('Grabbed a new comment!', commentStack.pop())
                setisCurrentComment(true)
            }
        }
    }, [isCurrentComment, doneInitializing])

    //just logging
    useEffect(() => {
        if (isCurrentComment) {
            console.log('Comment time:', currentComment.duration_timestamp)
            console.log('Duration bar time:', currentPosition)
        }
    }, [currentPosition, isCurrentComment])

    //if the times match , we have to display the commment, then say we need a new current Comment.
    useEffect(() => {
        if (
            isCurrentComment &&
            (parseInt(String(currentComment.duration_timestamp)) ==
                parseInt(String(currentPosition.currentPosition)) ||
                parseInt(String(currentComment.duration_timestamp)) <
                    parseInt(String(currentPosition.currentPosition)))
        ) {
            console.log(
                'THEY MATCH!',
                currentComment.duration_timestamp,
                'and',
                currentPosition
            )
            console.log('COMMENT CONTENT:', currentComment.content)
            dispatch(myAddRealTimeComment(currentComment))
            setisCurrentComment(false)
        }
    }, [currentPosition, isCurrentComment])

    const renderDurationCommentGIF = (commentGIFURL) => {
        if (commentGIFURL?.length > 0) {
            return (
                <img
                    src={`${commentGIFURL}`} //shows the user's current chosen GIF, if any
                />
            )
        }
    }

    return (
        <div>
            <h8>Most Popular </h8>
            <Switch onChange={getComments} />
            <List
                className="comment-list"
                header={`${0} replies`}
                itemLayout="horizontal"
                dataSource={realTimeComments}
                renderItem={(item) => (
                    <li>
                        <Comment
                            // actions={actions}
                            author={item.user.username}
                            // avatar={item.user.photo}
                            content={
                                <>
                                    <div>
                                        {renderDurationCommentGIF(item.gifURL)}
                                    </div>
                                    <div>{item.content}</div>
                                </>
                            }
                            datetime={item.comment_timestamp}
                        />
                        <div style={{ width: '110px', margin: '8px' }}>
                            <LikeDislikeComment
                                key={item.comment_id}
                                commentId={item.comment_id}
                            />
                        </div>
                    </li>
                )}
            />
        </div>
    )
}

export default DurationComments

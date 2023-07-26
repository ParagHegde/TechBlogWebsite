import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {formatISO9075} from 'date-fns'
import { UserContext } from '../UserContest';

export default function PostPage() {
    const {id} = useParams();
    const {userInfo} = useContext(UserContext);
    const[postInfo,setPostInfo]=useState(null);
    useEffect(()=>{
        fetch(`http://localhost:4000/post/${id}`).then(response=>{
            response.json().then(postInfo=>{
                setPostInfo(postInfo);
            })
        })
    },[])

    if(!postInfo) return '';
  return (
    <div className='postPage'>
        <h1>{postInfo.title}</h1>
        <time className='time'>{formatISO9075(new Date(postInfo.createdAt))}</time>
        <div className="author">by @{postInfo.author.username}</div>
        {
            userInfo.id === postInfo.author._id && (
                <div className='editRom'>
                    <Link className="editBtn" to={`/edit/${postInfo._id}`}>Edit this Post</Link>
                </div>
            )
        }
        <div className="image">
        <img src={`http://localhost:4000/${postInfo.cover}`} alt=":)" />
        </div>
        <div className='content' dangerouslySetInnerHTML={{__html:postInfo.content}}/>
    </div>
  )
}

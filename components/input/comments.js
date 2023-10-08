import { useContext, useEffect, useState } from 'react';

import CommentList from './comment-list';
import NewComment from './new-comment';
import classes from './comments.module.css';
import NotificationContext from '../../store/NotificationContext';

function Comments(props) {
  const { eventId } = props;

  const [showComments, setShowComments] = useState(false);
  const [comments,setComments] = useState([]);

  const notificationCtx = useContext(NotificationContext);
  const [isFetchingComment, setIsFetchingComment] = useState(false);

  useEffect(()=>{
    if(showComments){
      setIsFetchingComment(true);
      fetch('/api/comments/'+eventId)
      .then(res=>res.json())
      .then(data => {
        setComments(data.comments)
        setIsFetchingComment(false)
      })
    }
  },[showComments]);

  function toggleCommentsHandler() {
    setShowComments((prevStatus) => !prevStatus);
  }

  function addCommentHandler(commentData) {
    // send data to API
    notificationCtx.showNotification({
      title:"sending comment",
      message: 'Your comment is currently stored in database',
      status: 'pending'
    })

    fetch('/api/comments/' + eventId,{
      method: 'POST',
      body: JSON.stringify(commentData),
      headers:{
        'Content-Type':'application/json'
      }
    })
    .then((response) =>{
      if(response.ok){
        return response.json();
      }
      return response.json().then(data =>{
        throw new Error(data.message || 'Something went wrong');
      })
    })
    .then(data => {
      notificationCtx.showNotification({
        title:"Success!",
        message: 'Successfully added your comment',
        status: 'success'
      })
    }).catch(error=>{
      notificationCtx.showNotification({
        title:"Error!",
        message: 'your comment not get stored',
        status: 'error'
      })
    })
  }

  return (
    <section className={classes.comments}>
      <NewComment onAddComment={addCommentHandler} />
      <button onClick={toggleCommentsHandler}>
        {showComments ? 'Hide' : 'Show'} Comments
      </button>
      {showComments && !isFetchingComment && <CommentList comments={comments}/>}
      {showComments && isFetchingComment && <p>Loading...</p> }
    </section>
  );
}

export default Comments;

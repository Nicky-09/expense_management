import { SendOutlined, MessageOutlined } from "@ant-design/icons";
import { Button, Collapse, Input } from "antd";

import React, { useEffect, useState } from "react";
import moment from "moment";
import "./CommentCollapse.css";
import NameCircle from "./NameCirlce";
import { toast } from "react-toastify";
import { url } from "../config";
import NestedComment from "./NestedComment";

const { Panel } = Collapse;

const CommentCollapse = ({ isCollapseOpen, file, fetchListings }) => {
  const [commentInput, setCommentInput] = useState("");
  const [commentBoxOpen, setCommentBoxOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState("");

  // const [nestedComments, setNestedComments] = useState([]);

  const handleCommentChange = (e) => {
    setCommentInput(e.target.value);
  };

  const handleSendComment = async () => {
    const accessToken = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${url}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${accessToken}`,
        },
        body: JSON.stringify({
          fileId: file._id,
          comment: commentInput,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        fetchListings();
        setCommentInput("");
      } else {
        toast.error("Error:", data.message);
      }
    } catch (error) {
      toast.error("Error:", error);
    }
  };

  const handleSendOnEnter = (e) => {
    if (e.key === "Enter") {
      handleSendComment();
    }
  };

  const handleCommentBox = () => {
    setCommentBoxOpen(!commentBoxOpen);
  };

  const handleCommentBox1 = (commentId) => {
    console.log({ commentId });
    if (commentBoxOpen && selectedCommentId === commentId) {
      setCommentBoxOpen(false);
    } else {
      setCommentBoxOpen(true);
      setSelectedCommentId(commentId);
    }
  };

  console.log({ file });

  return (
    <div className="comment-container">
      <Collapse bordered={false} ghost activeKey={isCollapseOpen ? "1" : ""}>
        <Panel key="1" showArrow={false}>
          {file?.comments?.map((comment, index) => (
            <div key={index} className="comment-container">
              <div className="comment-box">
                <div className="user-detail-comment">
                  <NameCircle name={comment.username} />
                  <div className="userna">
                    <span className="share-username">{comment.username}</span>
                    {"  "}
                    <div className="access-detail">
                      {" "}
                      <span className="comment-time">
                        {moment(comment.createdAt).fromNow()}
                      </span>
                      {/* <span className="comment-time">{comment._id}</span> */}
                    </div>
                  </div>
                </div>
                <div className="comment-text">
                  {" "}
                  <span className="share-email">{comment.text}</span>
                  <div>
                    {comment?.comments?.map((el) => (
                      <div className="comment-child" key={el._id}>
                        {" "}
                        {el.text}
                      </div>
                    ))}
                  </div>
                  <MessageOutlined
                    onClick={() => handleCommentBox1(comment._id)}
                  />
                  {commentBoxOpen && selectedCommentId === comment._id && (
                    <NestedComment
                      commentId={comment._id}
                      fileId={file._id}
                      fetchListings={fetchListings}
                      commentBoxOpen={commentBoxOpen}
                      setCommentBoxOpen={setCommentBoxOpen}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="comment-input">
            <Input
              fullWidth
              value={commentInput}
              onChange={handleCommentChange}
              placeholder="Enter a comment"
              onKeyDown={handleSendOnEnter}
            />
            <Button
              type="text"
              onClick={handleSendComment}
              icon={<SendOutlined />}
            />
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default CommentCollapse;

import React, { useEffect, useState } from "react";
import "./PlayVideo.css";
import video1 from "../../assests/assets/video.mp4";
import like from "../../assests/assets/like.png";
import dislike from "../../assests/assets/dislike.png";
import share from "../../assests/assets/share.png";
import save from "../../assests/assets/save.png";
import jack from "../../assests/assets/jack.png";
import user_profile from "../../assests/assets/user_profile.jpg";
import { API_KEY, value_converter } from "../../data";
import moment from "moment";
import { useParams } from 'react-router-dom'

const PlayVideo = () => {

const  {videoId} = useParams();

  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState(null);

  const fetchVideoData = async () => {
    // Fetching video data
    const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
    await fetch(videoDetails_url)
      .then((res) => res.json())
      .then((data) => setApiData(data.items[0]));
  };

  const fetchOtherData = async () => {
    if (!apiData) return; 

    // Fetching channel data
    const channelDetails_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2Cstatistics&id=${apiData?.snippet?.channelId}&key=${API_KEY}`;
    await fetch(channelDetails_url)
      .then((res) => res.json())
      .then((data) => setChannelData(data.items[0]));

    // Fetching Comment data
    const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxREsult=50&videoId=${videoId}&key=${API_KEY}`;
    await fetch(comment_url)
      .then((res) => res.json())
      .then((data) => setCommentData(data.items));
  };
  
  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  useEffect(() => {
    fetchOtherData();
  }, [apiData]);

  if (!apiData || !channelData || !commentData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="play-video">
      <div>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
        <h3>{apiData?.snippet?.title}</h3>
        <div className="play-video-info">
          <p>
            {value_converter(apiData?.statistics?.viewCount) || "16K"} Views &bull;{" "}
            {moment(apiData?.snippet?.publishedAt).fromNow()}
          </p>
          <div>
            <span>
              <img src={like} alt="" />{" "}
              {value_converter(apiData?.statistics?.likeCount) || 155}
            </span>
            <span>
              <img src={dislike} alt="" />
            </span>
            <span>
              <img src={share} alt="" />
              Share
            </span>
            <span>
              <img src={save} alt="" />
              Save
            </span>
          </div>
        </div>
        <hr />
        <div className="publisher">
          <img
            src={channelData?.snippet?.thumbnails?.default?.url || ""}
            alt=""
          />
          <div>
            <p>{apiData?.snippet?.channelTitle}</p>
            <span>
              {value_converter(channelData?.statistics?.subscriberCount) || "1M"} Subscriber
            </span>
          </div>
          <button>Subscribe</button>
        </div>
        <div className="vid-description">
          <p>
            {apiData?.snippet?.description.slice(0, 250) || "Description Here"}
          </p>
          <hr />
          <h4>
            {value_converter(apiData?.statistics?.commentCount) || "102"} Comments
          </h4>
          {commentData.map((item, index) => (
            <div key={index} className="comment">
              <img
                src={item?.snippet?.topLevelComment?.snippet?.authorProfileImageUrl || ""}
                alt=""
              />
              <div>
                <h3>{item?.snippet?.topLevelComment?.snippet?.authorDisplayName}</h3>
                <span>1 day ago</span>
                <p>{item?.snippet?.topLevelComment?.snippet?.textDisplay}</p>
                <div className="comment-action">
                  <img src={like} alt="" />
                  <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                  <img src={dislike} alt="" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayVideo;

import React, { useState, useEffect, useRef } from "react";
import ApiManager from "../../../apiManager/ApiManager.js";
import Loader from "../../../components/styleComponent/Loader.jsx";
import useNotification from "../../../apiManager/useNotifications.js";
import Cookies from "js-cookie";

const apiManager = new ApiManager();

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
  return null;
}

const MembersDiv = ({ uniqueId, bio }) => {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [clickedConnect, setClickedConnect] = useState(false);

  const handleConnectClick = async () => {
    console.log(uniqueId, bio);
    setClickedConnect(true);

    try {
      const response = await apiManager.send_notification(uniqueId);

      if (response?.status === 200) {
        alert(`Notification sent successfully to: ${uniqueId}`);
      } else {
        alert(`Something is wrong with sending notification to: ${uniqueId}`);
      }
    } catch (err) {
      alert(`Error while sending notification: ${err.message}`);
    }

    await sleep(1000);
    setClickedConnect(false);
  };
  // ✅
  return (
    <div className="h-24 !mx-4 !px-4 !py-2 border-2 border-green-800 flex justify-between items-center">
      <div className="min-w-0">
        <div>
          <span className="font-normal">
            User: <span className="font-extralight">{uniqueId}</span>
          </span>
        </div>

        <div>
          <span className="truncate block w-full">
            <span className="font-normal">Bio: </span>
            {bio || "—"}
          </span>
        </div>
      </div>

      <div className="flex justify-center items-center h-full min-w-24 text-6xl">
        <button
          onClick={handleConnectClick}
          className="cursor-pointer  active:translate-y-[2px] active:scale-99"
        >
          {clickedConnect ? (
            <div className="blur-[1px]">✔️</div>
          ) : (
            <div className="blur-[1px]">💬</div>
          )}
        </button>
      </div>
    </div>
  );
};

const Home = () => {
  const [lastUniqueId, setLastUniqueId] = useState(null);
  const [uniqueIdBioList, setUniqueIdBioList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const messages = useNotification();
  useEffect(() => {
    if (!messages || !messages.length) return;

    const latest = messages[messages.length - 1];

    alert(`Got message from: ${latest.from}`);
  }, [messages]);

  const get_unique_id_and_bio = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      // const apiManager = new ApiManager();
      const response = await apiManager.get_unique_id_and_bio(lastUniqueId);

      if (response.status === 200) {
        setUniqueIdBioList((prev) => [...prev, ...response.data.users]);

        setLastUniqueId(response.data.last_unique_id);
        setHasMore(response.data.has_more);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  /* Initial Fetch */
  useEffect(() => {
    get_unique_id_and_bio();
  }, []);

  return (
    <div>
      <div className="bg-[#f2f2f2] h-[80vh] w-[50vw] overflow-y-auto scrollbar-custom scroll-fade">
        <div className="!my-8 flex flex-col gap-8">
          {uniqueIdBioList.map((user) => (
            <MembersDiv
              key={user.unique_id}
              uniqueId={user.unique_id}
              bio={user.bio}
            />
          ))}

          {loading && (
            <div className="h-[80vh] w-full flex justify-center items-center text-gray-500">
              <Loader />
            </div>
          )}

          {!hasMore && (
            <div className="text-center text-gray-400">No more users</div>
          )}
        </div>
      </div>

      {/* Optional manual pagination trigger */}
      {hasMore && (
        <div className="flex justify-center mt-4">
          <button
            onClick={get_unique_id_and_bio}
            className="px-4 py-2 border rounded"
            disabled={loading}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import UserType from "./components/UserType";
import Post from "./components/post/Post";
import Request from "./components/request/Request";
import Reply from "./components/reply/Reply";
import Rocket from "./components/rocket/Rocket";
import Loading from "./components/Loading";
import RequestDetailPage from "./components/reply/RequestDetailPage";
import PostDetailPage from "./components/request/PostDetailPage";

const App: React.FC = () => {

    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/Post/"
                        element={<Post />}
                    />
                    <Route
                        path="/Request/"
                        element={<Request />}
                    />
                    <Route
                        path="/Request/postId"
                        element={<PostDetailPage />} 
                    />
                    <Route
                        path="/Reply/"
                        element={<Reply />}
                    />
                    <Route
                        path="/Reply/replyId"
                        element={<RequestDetailPage />} 
                    />
                    <Route
                        path="/Rocket/"
                        element={<Rocket />}
                    />
                    <Route
                        path="/Selection/"
                        element={<UserType />}
                    />
                    <Route
                        path="/Loading/"
                        element={<Loading />}
                    />
                    <Route
                        path="/"
                        element={<Login />}
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;

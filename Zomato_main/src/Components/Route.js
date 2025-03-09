import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Home';
import Filter from "./Filter/Filter";
import Details from "./Details";
import Header from "./Header";
import { useEffect, useState } from "react";


const Router = () => {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const getUser = () => {
            
            fetch("http://localhost:5502/auth/login/success", {
               method: "GET",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                },
            })
            .then((response) => {
                console.log(response);
                if(response.status === 200) return response.json();
                throw new Error("Authentication Failed");
            })
            .then((resObject) => {
                setUser(resObject.user);
            })
            .catch((err) => {
                console.log(err);
            });
        };

        getUser();
        
        
    }, []);
    
     return (
        <BrowserRouter>
            <Header user= {user} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/filter" element={<Filter />} />
                <Route path="/details" element={<Details />} />
            </Routes>
        </BrowserRouter>
     )
}

export default Router;
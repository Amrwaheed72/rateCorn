import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import StarRating from './StarRating';


// function Test() {

//   const [movieRate,setMovieRate]=useState(0)

//   return (
//     <div>
//       <StarRating maxRating={10} color='blue' setMovieRate={setMovieRate} />
//       <p>This movie was rated {movieRate} stars</p>
//     </div>
//   )
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating maxRating={5} />
    <StarRating size='24' color='red' />
    <Test /> */}
  </React.StrictMode>
);

import React, { useState } from 'react';
import './App.css';
import { Formik, Form, Field } from 'formik';

const paths = ['/get-track-from-id/', '/get-tracks-from-artist/'];

const App = () => {
  const [data, setData] = useState('Search for a song below');

  const getAPIDetails = async (vals) => {
    const isArtist = vals.picked === 'artist' ? 1 : 0;
    const path = paths[isArtist];

    const url = new URL('http://localhost:3000' + path + vals.text);
    const response = await fetch(url, {});
    const jsonData = await response.json();

    if (Object.keys(jsonData.err).length !== 0) return jsonData.err.message;
    else return isArtist ? jsonData.data.artistTracks : jsonData.data.track;
  };

  return (
    <div className="App">
      <div className="container data-area">
        {Array.isArray(data)
          ? data.map(function (name, index) {
              return (
                <div key={index}>
                  <p>
                    ID: {name.id}, Title: {name.title}
                  </p>
                </div>
              );
            })
          : data}
      </div>
      <div className="container form-area">
        <Formik
          initialValues={{
            text: '',
            picked: '',
          }}
          onSubmit={async (vals) => {
            setData(await getAPIDetails(vals));
          }}
        >
          <Form>
            <Field
              type="text"
              name="text"
              placeholder="Enter search text"
              className="textbox"
            />
            <div role="group" aria-labelledby="my-radio-group">
              <label>
                <Field type="radio" name="picked" value="id" />
                Get track name from ID
              </label>
              <label>
                <Field type="radio" name="picked" value="artist" />
                Get list of songs from artist
              </label>
            </div>

            <button type="submit">Submit</button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default App;

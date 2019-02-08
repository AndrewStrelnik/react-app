import React from 'react';

function Home () {
	return(
    <div className="homepage">
        <h2>Hello :) This is short explanation:</h2>
        <p>The <strong>Notes</strong> tab has an application for making notes with saving them in LocalStorage. </p>
        <p><img src={require('./assets/Notes.gif')} className="mainPage-gif" /></p>
        <p>The <strong>Table</strong> tab has a simple table with the ability to sort and search and view detailed characteristics in additional window. The data is given from the JSON file.</p>
        <p><img src={require('./assets/Table.gif')} className="mainPage-gif" /></p>
        <p>The <strong>Stats</strong> tab allows you to view and compare statistics of the players of Rainbow Six Siege</p>
        <p><img src={require('./assets/Stats.gif')} className="mainPage-gif" /></p>
    </div>
	)
}

export default Home;
    
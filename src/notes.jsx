import React, { Component } from 'react';
import Masonry from 'masonry-layout';
import './style.css';
import { Button } from 'antd';

class Note extends Component {
  render() {
    let style = {backgroundColor: this.props.color};
    return (
      <div className="note" style={style}>
      <span className="delete-note" onClick={this.props.onDelete}> × </span>
      {this.props.children}
      </div>
    );
  }
}

class NoteEditor extends Component {
  constructor(props){
    super(props);
    this.state = {
      text:''
    }
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleNoteAdd = this.handleNoteAdd.bind(this);
  }
  handleTextChange(event){
    this.setState({text: event.target.value})
  }
  handleNoteAdd(){
    let newNote = {
      text: this.state.text,
      id: Date.now()
    }
    this.props.onNoteAdd(newNote);
    this.setState({ text: '' });
  }
  render() {
    return (
      <div className="note-editor">
        <textarea placeholder="Enter your note here..." rows="5" className="textarea" value={this.state.text} onChange={this.handleTextChange}/>
        <Button className="notesButton"
        type="primary" onClick={this.handleNoteAdd}>Add</Button>
      </div>
    );
  }
}

class NotesGrid extends Component {
  componentDidMount() {
    let elem = this.refs.grid;
    this.msnry = new Masonry( elem, {
      itemSelector: '.note',
      columnWidth: 200,
      gutter: 10,
      isFitWidth: true
    });
  }

  componentDidUpdate(prevProps){
    if (this.props.notes.length !== prevProps.notes.length){
      this.msnry.reloadItems();
      this.msnry.layout();
    }  
  }

  render() {
    return (
      <div className="notes-grid" ref="grid">
        {
          this.props.notes.map((note)=>{
            return <Note key={note.id} onDelete={this.props.onNoteDelete.bind(null, note)} color={note.color}>{note.text}</Note>
          })
        }
      </div>
    );
  }
}
class NotesApp extends Component {
  constructor(props) {
    super(props);
    this.state = {notes: [
      // {id:0, text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure.", color: "#FFD700"},
      // {id:1, text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Porro!", color: "#90EE90"},
      // {id:2, text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quam inventore molestias nulla fugiat sit maxime, sed voluptatem?", color: "#FFA07A"},
      // {id:3, text: "Lorem ipsum dolor sit amet.", color: "#FFB6C1"}
    ]}
    this.handleNoteAdd = this.handleNoteAdd.bind(this);
    this._updateLocalStorage = this._updateLocalStorage.bind(this);
    this.handleNoteDelete = this.handleNoteDelete.bind(this);
  }

  componentDidMount(){
    var localNotes = JSON.parse(localStorage.getItem('notes'));
    if (localNotes) {
        this.setState({ notes: localNotes });
    }
  }

  componentDidUpdate(){
    this._updateLocalStorage();
  }

  handleNoteAdd(newNote){
    let newNotes = this.state.notes.slice();
    newNotes.unshift(newNote);
    this.setState({notes: newNotes})
  }

  handleNoteDelete(note){
    let noteId = note.id;
    let newNotes = this.state.notes.filter(function(note) {
        return note.id !== noteId;
    });
    this.setState({ notes: newNotes });
  }

  _updateLocalStorage(){
    let notes = JSON.stringify(this.state.notes);
    localStorage.setItem('notes', notes);
  }

  render() {
    return (
      <div className='mount-point'>
      <div className="notes-app">
        <NoteEditor onNoteAdd={this.handleNoteAdd}/>
        <NotesGrid notes={this.state.notes} onNoteDelete={this.handleNoteDelete}/>
      </div>
      </div>
    );
  }
}
export default NotesApp;

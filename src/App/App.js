import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import StateContext from '../StateContext';
import './App.css';

class App extends Component {
    state = {
        notes: [],
        folders: [],
        error: null
    };

    deleteNote = noteId => {
        const newNotes = this.state.notes.filter(note => note.id !== noteId)
        this.setState({
            notes: newNotes
        });
    }

    componentDidMount() {
        fetch('http://localhost:9090/folders') 
            .then(res => {
                if(!res.ok) {
                    throw new Error(res.statusText);
                }
                return res.json()
        })
        .then(res => {
                // const folders = Object.keys(res)
                //     .map(key => res[key].item[0])
                this.setState({
                folders: res,
            })
        })
        .catch(err => this.setState({
            error: err.message
        }))

        fetch('http://localhost:9090/notes')
            .then(res => {
                if(!res.ok){
                    throw new Error(res.statusText);
                }
                return res.json();
            })
            .then(res => this.setState({
                notes: res
            }))
            .catch(err => this.setState({
                error: err.message
            }))
    }

    renderNavRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListNav}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    render={routeProps => {
                        return <NotePageNav {...routeProps}/>
                    }}
                />
                <Route path="/add-folder" component={NotePageNav} />
                <Route path="/add-note" component={NotePageNav} />
            </>
        );
    }

    renderMainRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        render={routeProps => {
                            return (
                                <NoteListMain
                                    {...routeProps} 
                                />
                            );
                        }}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    // component={NotePageMain}
                    render={routeProps => {
                        return <NotePageMain {...routeProps} />;
                    }}
                />
            </>
        );
    }

    render() {
        return (
            <StateContext.Provider value={{
                folders: this.state.folders,
                notes: this.state.notes,
                deleteNote: this.deleteNote
            }}>
                <div className="App">
                    <nav className="App__nav">{this.renderNavRoutes()}</nav>
                    <header className="App__header">
                        <h1>
                            <Link to="/">Noteful</Link>{' '}
                            <FontAwesomeIcon icon="check-double" />
                        </h1>
                    </header>
                    <main className="App__main">{this.renderMainRoutes()}</main>
                </div>
            </StateContext.Provider>
        );
    }
}

export default App;

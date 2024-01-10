import './App.css';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import lodash from 'lodash';
import { FaRegTrashCan } from "react-icons/fa6";
import { FaPenToSquare } from "react-icons/fa6";

function App() {
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [content, setContent] = useState(null);

  const elementRef = useRef(null);

  const updateContent = (newContent) => {
    setContent(newContent);
    elementRef.current.innerText = newContent;
  };

  function noteHandler(e) {
    const body = e.currentTarget.innerText;
    const title = body?.split('\n')[0];

    if (selectedId) {
      updateNote(selectedId, title, body);
    } else {
      createNote(title);
    }
  }

  function deleteHandler(id) {
    if (selectedId) {
      void axios.delete(`http://localhost:3030/notes/${id}`).then((res) => {
        if (res.data.status === 'ok') {
          getNotes();

          setSelectedId(null);
          updateContent('');
        }
      });
    }
  }

  const createNote = useCallback(
      lodash.debounce(function (title) {
        void axios
            .put('http://localhost:3030/notes', {
              title,
            })
            .then((res) => {
              if (res.data.status === 'ok') {
                getNotes();
                setSelectedId(res.data.id);
              }
            });
      }, 1000),
      []
  );

  const updateNote = useCallback(
      lodash.debounce(async function (id, title, body) {
        void axios
            .post('http://localhost:3030/notes', {
              id,
              title,
              body,
            })
            .then((res) => {
              if (res.data.status === 'ok') {
                getNotes();
              }
            });
      }, 1000),
      []
  );

  const getNotes = () => {
    void axios.get('http://localhost:3030/notes').then((res) => {
      setNotes(res.data);
    });
  };

  function selectNoteHandler(note) {
    setSelectedId(note.id);
    updateContent(note.body);
  }

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      getNotes();

      ignore = true;
    }
  }, [])

  return (
      <main className='homePage'>
        <ul className='notesList'>
          <input className='search' type='search' placeholder='Search all notes' />

          {notes.map((note) => {
            const { title, body } = note;
            const excerpt = body?.split('\n')[1] ?? '';

            return (
                <li
                    key={note.id}
                    className={`${'note'} ${note.id === selectedId && 'default'}`}
                    onClick={() => {
                      selectNoteHandler(note);
                    }}
                >
                  <h2>{title}</h2>
                  <p>{excerpt}</p>
                </li>
            );
          })}
        </ul>

        <section className='form'>
          <div className='tools'>
            <div
                className='iconWrapper'
                onClick={() => {
                  deleteHandler(selectedId);
                }}
            >
                <FaRegTrashCan />
            </div>
            <div
                className={'iconWrapper'}
                onClick={() => {
                  const title = 'New Note';
                  void axios
                      .put('http://localhost:3030/notes', {
                        title,
                      })
                      .then((res) => {
                        if (res.data.status === 'ok') {
                          getNotes();
                        }
                      });
                }}
            >
                <FaPenToSquare />
            </div>
          </div>
          <div className='content'>
            <div
                ref={elementRef}
                contentEditable='true'
                onInput={noteHandler}
                tabIndex={1}
                style={{ display: selectedId === null ? 'none' : 'block' }}
            />
          </div>
        </section>
      </main>
  );
}

export default App;

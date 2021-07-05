import { useParams, useHistory } from 'react-router-dom';
import Logo from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';

import deleteImg from '../assets/images/delete.svg'

import '../styles/room.scss';
// import { useAuth } from './../hooks/useAuth';
import { useRoom } from './../hooks/useRoom';
import { database } from '../services/firebase';

type RoomParams = {
    id: string;
}


export function AdminRoom() {
    // const { userData } = useAuth();
    const { id } = useParams<RoomParams>();
    const roomId = id;
    const history = useHistory();

    const { title, questions } = useRoom(roomId);

    async function handleDeleteQuestion(questionId: string) {
        const confirm = window.confirm('Você tem certeza que deseja excluir essa pergunta');
        if (confirm) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    async function handleEndRoom(){
        database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push('/');
    }

    // Add verify if change, delete and moved firebase event in future

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={Logo} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom}> Encerrar Sala</Button>
                    </div>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && (
                        <span>{questions.length} pergunta(s)</span>
                    )}
                </div>
                <div className="question-list">
                    {questions && questions.map(question => (
                        <Question
                            key={question.id}
                            author={question.author}
                            content={question.content}>
                            <button type="button" onClick={() => handleDeleteQuestion(question.id)}>
                                <img src={deleteImg} alt="Remover pergunta" />
                            </button>
                        </Question>
                    ))}
                </div>

            </main>
        </div>
    )
}
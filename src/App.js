import "./App.css";
import { Component, useState } from "react";
import PropTypes from "prop-types";

const Card = ({ id, title, message, tag, user, onDelete, onChangeTitle }) => {
  const [inputValue, setInputValue] = useState(title);

  const handleTitleChange = (e) => {
    setInputValue(e.target.value);
    onChangeTitle(e.target.value, id);
  };

  return (
    <div className="card">
      <textarea
        className="card__title"
        value={inputValue}
        onChange={handleTitleChange}
      />
      <div className="card__info">
        <div className="avatar">{user}</div>
        <div>{tag}</div>
        <button className="delete" onClick={() => onDelete(id)}>
          delete
        </button>
      </div>
    </div>
  );
};

Card.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string,
  tag: PropTypes.string,
  user: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  onChangeTitle: PropTypes.func.isRequired,
};

class Wrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardList: [],
    };
  }

  componentDidMount() {
    const cards = JSON.parse(localStorage.getItem("to-do")) || [];
    this.setState({
      cardList: cards,
    });
  }

  componentDidUpdate() {
    localStorage.setItem("to-do", JSON.stringify(this.state.cardList));
  }

  createHandler = () => {
    const newCard = {
      id: Math.ceil(Math.random() * 100),
      title: "...",
      message: "",
      tag: "go",
      user: "A",
    };
    this.setState((prevState) => ({
      cardList: [...prevState.cardList, newCard],
    }));
  };

  handleDeleteCard = (id) => {
    this.setState((prevState) => ({
      cardList: prevState.cardList.filter((item) => item.id !== id),
    }));
  };

  handleChangeCardTitle = (text, id) => {
    this.setState((prevState) => ({
      cardList: prevState.cardList.map((item) =>
        item.id === id ? { ...item, title: text } : item
      ),
    }));
  };

  render() {
    const { cardList } = this.state;
    const { type, title } = this.props;
    const classNames = [type, "colum-wrapper"];
    return (
      <div className={classNames.join(" ")}>
        <h2 className="colum-wrapper__title">{title}</h2>
        {cardList.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            title={card.title}
            message={card.message}
            tag={card.tag}
            user={card.user}
            onDelete={this.handleDeleteCard}
            onChangeTitle={this.handleChangeCardTitle}
          />
        ))}
        <button className="create-card" onClick={this.createHandler}>
          Create +
        </button>
      </div>
    );
  }
}

Wrapper.propTypes = {
  type: PropTypes.oneOf(["to-do", "in-progress", "review", "done"]).isRequired,
  title: PropTypes.string.isRequired,
};

function App() {
  return (
    <div className="app">
      <h1 className="title">Trello</h1>
      <div className="desck">
        <Wrapper title={"To-do"} type="to-do" />
        <Wrapper title={"In Progress"} type="in-progress" />
        <Wrapper title={"In Progress"} type="reviev" />
        <Wrapper title={"In Progress"} type="done" />
      </div>
    </div>
  );
}

export default App;

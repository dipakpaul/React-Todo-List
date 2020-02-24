import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = { todos: [], open: false };
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.saveTodo = this.saveTodo.bind(this);
    this.inputRef = React.createRef();
  }

  async componentDidMount() {
    const res = await fetch('http://localhost:3000/todos');
    res.json()
    .then(res => {
      this.setState({ todos: res });
    });
    
  }

  async saveTodo(e) {
    e.preventDefault();
    const options = {
      method: 'post',
      headers: {
        Accept: "application/json", 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todo: this.inputRef.current.value })
    };
    const res = await fetch("http://localhost:3000/todos", options);
    const json = await res.json();
    this.setState({ todos: json });
    this.inputRef.current.value = null;
    return false;
  }

  onOpen(item) {
    this.setState(
      Object.assign({}, this.state, { open: true, clickedItem: item })
    );
  }

  onClose() {
    this.setState(
      Object.assign({}, this.state, { open: false })
    );
  }

  render() {
    return(
      <form onSubmit={this.saveTodo}>
        <ul>{(this.state.todos).length > 0 && this.state.todos.map( (todo, i) => (
          <li key={i} onClick={() => this.onOpen(todo)}>
            {todo}
          </li>))}
        </ul>
        <input placeholder="add todo" ref={this.inputRef} />
        <Modal 
          open={this.state.open}
          onClose={this.onClose}
          content={this.state.clickedItem}
        />
      </form>
    );
  }
}

let node = null;

class Modal extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  static getDerivedStateFromProps(next, prev){
    node && ReactDOM.render(<ModalBox {...next} />, node);
    return next;
  }

  componentDidMount() {
    node = document.createElement("div");
    document.body.appendChild(node);
    ReactDOM.render(<ModalBox {...this.props} />, node);
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(node);
    node.parentNode && node.parentNode.removeChild(node);
  }

  render(){
    return <script />;
  }
}

const ModalBox = ({ content, onClose, open }) => {
  const className = open ? "click-catcher--open" : "click-catcher";
  return (
    <div className={className} onClick={onClose}>
      <div className="modal">{ content }</div>
    </div>
  );
}; 

ReactDOM.render(<App />, document.getElementById('root'));

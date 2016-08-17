/* eslint-disable max-len, arrow-body-style, no-underscore-dangle
, react/no-string-refs*/

import React from 'react';
import axios from 'axios';

export default class Tasks extends React.Component {
  constructor(props) {
    super(props);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.complete = this.complete.bind(this);
    this.state = { tasks: [] };
  }

  componentWillMount() {
    axios.get('//localhost:9001/api/tasks')
    .then((rsp) => {
      this.setState({ tasks: rsp.data.content });
    });
  }

  create(e) {
    e.preventDefault();
    const name = this.refs.name.value;
    const category = this.refs.category.value;
    const due = this.refs.due.value;
    axios.post('//localhost:9001/api/tasks', { name, category, due })
    .then((rsp) => {
      this.setState({ tasks: [...this.state.tasks, rsp.data] });
    });
  }

  complete(e) {
    const myTasks = this.state.tasks;
    const taskId = e.currentTarget.getAttribute('data-id');
    axios.patch(`//localhost:9001/api/tasks/${taskId}/complete`)
    .then((rsp) => {
      const task = myTasks.find(t => t.id === taskId * 1);
      task.complete = rsp.data.complete;
      this.setState({ tasks: this.state.tasks });
    });
  }

  delete(e) {
    console.log('this', this);
    const myTasks = this.state.tasks;
    console.log('Delete!!!');
    const taskId = e.currentTarget.getAttribute('data-id');
    axios.delete(`//localhost:9001/api/tasks/${taskId}`)
    .then(() => {
      const myIndex = myTasks.indexOf((myTasks.find(t => t.id === taskId * 1)));
      myTasks.splice(myIndex, 1);
      console.log('mytasks', myTasks);
      this.setState({ tasks: myTasks });
    });
  }

  render() {
    return (
      <div>
        <h1>My Tasks</h1>

        <div className="row">
          <div className="col-xs-3">
            <form>
              <div className="form-group">
                <label htmlFor="name">Task</label>
                <input ref="name" type="text" className="form-control" id="name" />
              </div>

              <div className="form-group">
                <label htmlFor="url">Category</label>
                <input ref="category" type="text" className="form-control" id="category" />
              </div>

              <div className="form-group">
                <label htmlFor="url">Due</label>
                <input ref="due" type="text" className="form-control" id="due" />
              </div>

              <button onClick={this.create} type="submit" className="btn btn-default">Create</button>
            </form>
          </div>
          <div className="col-xs-9">
          </div>
        </div>

        <div className="row">
          <div className="col-xs-3">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Category</th>
                  <th>Due Date</th>
                  <th>Completed?</th>
                  <th>Complete me!!</th>
                  <th>Delete me!!</th>
                </tr>
              </thead>
              <tbody>

                {this.state.tasks.map(task => (
                  <tr key={task.id}>
                    <td>{task.name}</td>
                    <td>{task.category}</td>
                    <td>{task.due}</td>
                    <td>{task.complete ? 'True' : 'False'}</td>
                    <td><button data-id={task.id} onClick={this.complete}>Complete Me</button></td>
                    <td><button data-id={task.id} onClick={this.delete}>Delete Me</button></td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

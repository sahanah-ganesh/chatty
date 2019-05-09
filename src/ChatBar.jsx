import React, { Component } from 'react';

// Render chatbar with username and message input fields that trigger event on enter
class ChatBar extends Component {
  render() {
    return (
      <footer className='chatbar'>
        <input onKeyUp={this.props.addUser} className='chatbar-username' placeholder={this.props.currentUser.name} />
        <input onKeyUp={this.props.addMessage} className='chatbar-message' placeholder='Type a message and hit ENTER' />
      </footer>
    );
  };
}
export default ChatBar;

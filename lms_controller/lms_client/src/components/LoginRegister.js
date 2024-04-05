import React, { Component } from "react";
import { useNavigate } from 'react-router-dom';

function LoginRegisterWrapper() {
  const navigate = useNavigate();

  return <LoginRegister navigate={navigate} />;
}


class LoginRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRegistering: true,
      username: '',
      password: '',
      email: '',
      role: 'student',
      message: ''

    };
  }
  
  handleRegister = async (event) => {
    event.preventDefault();
    const { username, password, email, role } = this.state;

    try {
      const response = await fetch('api/registration/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, role })
      });

      if (response.status === 201) {
        this.setState({ message: 'Registration successful' });
      } else {
        this.setState({ message: 'Registration failed' });
      }
    } catch (error) {
      this.setState({ message: 'Error: ' + error.message });
    }
  };

  handleLogin = async (event) => {
    event.preventDefault();
    const { username, password } = this.state;

    try {
      const response = await fetch('api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.status === 200) {
        const data = await response.json();
        this.props.navigate(`/${data.role}`, { state: { username: data.username } });
      } else {
        this.setState({ message: 'Login failed' });
      }
    } catch (error) {
      this.setState({ message: 'Error: ' + error.message });
    }
  };


  render() {
    const { isRegistering, username, password, email, role, message } = this.state;
    return (
      <div>
        <button onClick={() => this.setState({ isRegistering: !isRegistering })}>
          {isRegistering ? 'Go to Login' : 'Go to Register'}
        </button>

        {isRegistering ? (
          <form onSubmit={this.handleRegister}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => this.setState({ username: e.target.value })} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => this.setState({ password: e.target.value })} />
            <input type="text" placeholder="Email" value={email} onChange={(e) => this.setState({ email: e.target.value })} />
            <select value={role} onChange={(e) => this.setState({ role: e.target.value })}>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
            <button type="submit">Register</button>
          </form>
        ) : (
          <form onSubmit={this.handleLogin}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => this.setState({ username: e.target.value })} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => this.setState({ password: e.target.value })} />
            <button type="submit">Login</button>
          </form>
        )}

        {message && <p>{message}</p>}
      </div>
    );
  }

  
}

export default LoginRegisterWrapper;




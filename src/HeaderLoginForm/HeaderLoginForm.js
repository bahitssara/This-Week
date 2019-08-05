import React from 'react'
import './HeaderLoginForm.css'
import TokenService from '../services/token-service'
import AuthApiService from '../services/auth-api-service'
import ThisWeekContext from '../ThisWeekContext'

class HeaderLoginForm extends React.Component{
    static defaultProps = {
        onLoginSuccess: () => {}
    };

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            user: '',
            error: null,
            emailValid: false,
            passwordValid: false,
            validationMessages: {
                email: '',
                password: '',
            }
        }
    }

    addEmail(email) {
        this.setState({ email }, () => { this.validateEmail(email) });
    }

    addPassword(password) {
        this.setState({ password }, () => { this.validatePassword(password) });
    }

    validateEmail(fieldValue) {
        const fieldErrors = { ...this.state.validationMessage }
        let hasError = false;

        fieldValue = fieldValue.trim();
        if (fieldValue.length === 0) {
            fieldErrors.email = 'Email is required';
            hasError = true;
        } else {
            if (fieldValue.length < 3) {
                fieldErrors.email = 'Email must be at least 3 characters long';
                hasError = true;
            } else {
                fieldErrors.email = '';
                hasError = false;
            }
        }

        this.setState({
            validationMessages: fieldErrors,
            emailValid: !hasError
        }, this.formValid);
    }

    validatePassword(fieldValue) {
        const fieldErrors = { ...this.state.validationMessage }
        let hasError = false;

        fieldValue = fieldValue.trim();
        if (fieldValue.length === 0) {
            fieldErrors.password = 'Password is required';
            hasError = true;
        } else {
            if (fieldValue.length < 8) {
                fieldErrors.password = 'Password must be at least 8 characters long';
                hasError = true;
            } else {
                fieldErrors.password = '';
                hasError = false;
            }
        }

        this.setState({
            validationMessages: fieldErrors,
            passwordValid: !hasError
        }, this.formValid);
    }

    formValid() {
        this.setState({
            formValid: this.state.emailValid && this.state.passwordValid
        });
    }

    // Handle user login and create auth token 
    handleSubmitJwtAuth = ev => {
        ev.preventDefault();
        this.setState({ error: null });
        const { email, password } = ev.target
        AuthApiService.postLogin({
            email: email.value,
            password: password.value,
        })
            .then(res => {
                email.value = ''
                password.value = ''
                TokenService.saveAuthToken(res.authToken)
                TokenService.saveUserId(res.userid)
                window.location = '/events';
            })
            .catch(res => {
                this.setState({ error: res.error })
            })
    }
    static contextType = ThisWeekContext;

    render() {
        const { error } = this.state;
        return(
            <section className='sign-in'>
                <form className='sign-in-form' onSubmit={this.handleSubmitJwtAuth}>
                    <label htmlFor='email'>Email</label>
                    <input 
                        type='text'
                        name='email'
                        id='email'
                        value={this.state.email}
                        onChange={e => this.addEmail(e.target.value)}
                    />
                    {/* <ValidationError className='validation-error'/> */}
                    <label htmlFor='email'>Password</label>
                    <input 
                        type='text'
                        name='password'
                        id='password'
                        value={this.state.password}
                        onChange={e => this.addPassword(e.target.value)}
                    />
                    {/* <ValidationError hasError={!this.state.passwordValid} message={this.state.validationMessages.password} /> */}
                    <button type='submit'>Sign In</button>
                    <div className="error" role="alert">
                            {error && <span className="login-error">{error}</span>}
                    </div>
                </form>
            </section>
        )
    }
}

export default HeaderLoginForm


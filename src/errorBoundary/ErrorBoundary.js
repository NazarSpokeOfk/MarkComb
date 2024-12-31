import React, { Component } from 'react';
class ErrorBoundary extends Component{
    constructor(props){
        super(props)
        this.state = {
            hasError:false,
            errorInfo:null
        }
    }
    static getDerivedStateFromError(error) {
        // Обновляем состояние, чтобы отобразить запасной UI
        return { hasError: true };
      }

    componentDidCatch(error,errorInfo){
        console.log("Ошибка в errorBoundary:",error , errorInfo)
    }

    render(){
        if(this.state.hasError){
            <h2>Произошла ошибка! Попробуйте еще раз позже.</h2>
        }

        return this.props.children
    }
}
export default ErrorBoundary
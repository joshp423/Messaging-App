import Login from "./Login/login"

type homepageProps = {
    loginStatus: boolean
}

function Homepage( { loginStatus }: homepageProps ) {


    if (loginStatus) {
        return (
            <Login />
        )
    }

    return (
        <div className='hpMain'>
            
        </div>
    )
    
}

export default Homepage

    
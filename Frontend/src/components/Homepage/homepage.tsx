import { useOutletContext } from "react-router-dom";

type homepageProps = {
    loginStatus: boolean
}

function Homepage() {

    const { loginStatus } = useOutletContext<homepageProps>()

    if (loginStatus) {
        return (
            <>bre</>
        )
    }

    return (
        <div className='hpMain'>
            
        </div>
    )
    
}

export default Homepage

    
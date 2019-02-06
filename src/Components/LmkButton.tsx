import React from 'react';
import Button from '@material-ui/core/Button'

interface props {
    disabled?:boolean;
    onClick:()=>any;
    children:any;
}

const styles = {
    button:{
        backgroundColor: '#2089dc',
        borderRadius: 50,
        color:"white",
        width:'212px'
    }
};

export default (props:props) =>{
    return (
        <div>
            <Button style={styles.button}
                    disabled={props.disabled}
                    onClick={props.onClick}
                    fullWidth={true}
            >
                {props.children}
            </Button>
        </div>
    )
};
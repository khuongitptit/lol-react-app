import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import champs from './data/data.js'

const ROLE_CHECKBOXS = [
    {
        id:0,
        name:"satthu",
        value:"satthu",
        display:"Sát thủ",
        isChecked:false
    },
    {
        id:1,
        name:"xathu",
        value:"xathu",
        display:"Xạ thủ",
        isChecked:false
    },
    {
        id:2,
        name:"phapsu",
        value:"phapsu",
        display:"Pháp sư",
        isChecked:false
    },
    {
        id:3,
        name:"hotro",
        value:"hotro",
        display:"Hỗ trợ",
        isChecked:false
    },
    {
        id:4,
        name:"dodon",
        value:"dodon",
        display:"Đỡ đòn",
        isChecked:false
    },
    {
        id:5,
        name:"dausi",
        value:"dausi",
        display:"Đấu sĩ",
        isChecked:false
    }    
];

const TYPE_CHECKBOXS = [
    {
        id:0,
        name:"danhxa",
        value:"danhxa",
        display:"Đánh xa",
        isChecked:false
    },
    {
        id:2,
        name:"canchien",
        value:"canchien",
        display:"Cận chiến",
        isChecked:false
    }
];
class Checkbox extends React.Component{
    handleCheck = event => {
        this.props.onCheck(event.target.name);
    }
    render(){
        const checkbox = this.props.checkbox;
        return (
            <>
                <input 
                    type="checkbox" 
                    name={checkbox.name}
                    value={checkbox.value}
                    checked={checkbox.isChecked}
                    onClick={this.handleCheck}
                /><span>{checkbox.display}</span>
                <br/>
            </>
        );
    }
}

class CheckboxGroup extends React.Component{
    render(){
        const checkboxs= this.props.checkboxs;
        let list = [];
        checkboxs.forEach(checkbox => {
            list.push(
                <Checkbox checkbox = {checkbox} onCheck={this.props.onCheck}/>
            );
        });
        return (
            <>
                {list}
            </>
        );
    }
}

class Searchbox extends React.Component{
    handleSearchTextChange = event => {
        this.props.onSearchTextChange(event.target.value);
    }
    render(){
        return (
            <input 
                type="text" 
                placeholder="Tìm kiếm.."
                value = {this.props.searchText}
                onChange = {this.handleSearchTextChange}
            />
        );
    }
}
class Filter extends React.Component{
    
    render(){
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-3 role">
                        <h1>Vai trò</h1>
                        <CheckboxGroup 
                            checkboxs={this.props.role_checkboxs}
                            onCheck={this.props.onRoleCheck}
                        />
                    </div>
                    <div className="col-3 type">
                        <h1>Đặc biệt</h1>
                        <CheckboxGroup 
                            checkboxs={this.props.type_checkboxs}
                            onCheck={this.props.onTypeCheck}
                        />
                    </div>
                    <div className="col-3 search">
                        <Searchbox onSearchTextChange={this.props.onSearchTextChange}/>
                    </div>
                </div>

            </div>
        );
    }
}

class Champ extends React.Component{
    handleMouseMove = event => {
        this.props.mouseMove(event.target.src,event.clientX,event.clientY);
    }
    handleMouseOut = event => {
        this.props.mouseOut(event.target.src);
    }
    render(){
        const champ = this.props.champ;
        return (
                <div className="champ_container">
                    <img
                        src={champ.img}
                        alt={champ.name}
                        className="img_champ mx-2 my-2"
                        onMouseMove = {this.handleMouseMove}
                        onMouseOut = {this.handleMouseOut}
                        
                    />
                </div>
                
        );
    }
}
class ChampToolTip extends React.Component{
    render(){
        const champ = this.props.champ;
        const display = this.props.display;
        const x = this.props.x+10;
        const y = this.props.y+10;
        const bg="url("+champ.bg+")";
        const tt_style = {
            left:x,
            top:y,
            // backgroundImage:"url(/"+{bg}+")"
            backgroundImage: bg
        };
        return (
            display 
                &&
            <div className="champ_tooltip" style={tt_style}>
                <h3 className="champ_name text-center text-white">{champ.name}</h3>
                <div className="skills d-flex flex-wrap justify-content-center mt-5">
                    <img className="ml-3" src={champ.passive}/>
                    <img className="ml-3" src={champ.q}/>
                    <img className="ml-3" src={champ.w}/>
                    <img className="ml-3" src={champ.e}/>
                    <img className="ml-3" src={champ.r}/>
                </div>
                
            </div>
        );
    }
}
class ChampWrapper extends React.Component{
    render(){
        const champs = this.props.champs;
        const searchText = this.props.searchText;
        const roles = [];
        const types = [];
        const role_checkboxs = this.props.role_checkboxs;
        const type_checkboxs = this.props.type_checkboxs;
        const stack = [];

        role_checkboxs.forEach( role_checkbox => {
            if(role_checkbox.isChecked)  roles.push(role_checkbox.display);
        });
        type_checkboxs.forEach( type_checkbox => {
            if(type_checkbox.isChecked)  types.push(type_checkbox.display);
        });

        champs.forEach(champ => {
            let roles_matched_number = 0;
            let types_matched_number = 0;
            roles.forEach(role => {
                if(champ.role.includes(role)) roles_matched_number++;
            }); 
            
            types.forEach(type => {
                if(champ.type.includes(type)) types_matched_number++;
            });
            if(roles_matched_number === roles.length && types_matched_number === types.length){
                if(champ.name.toLowerCase().indexOf(searchText.toLowerCase()) === -1) return;
                    stack.push(
                        <Champ 
                            champ={champ} 
                            key={champ.name}
                            mouseMove={this.props.mouseMove}
                            mouseOut={this.props.mouseOut}
                        />
                    );
            }

        });

        return (
            <div className="d-flex flex-wrap container">
                {stack}
            </div>
        );
    }
}



class App extends React.Component{
    constructor(props){
        super(props);
        this.state={
            searchText:'',
            role_checkboxs: ROLE_CHECKBOXS,
            type_checkboxs:TYPE_CHECKBOXS,
            x: 0,
            y: 0,
            display: false,
            champ: champs[0]
        };

    }

    handleRoleCheck = name => {
        const role_checkboxs = this.state.role_checkboxs;
        role_checkboxs.forEach(role_checkbox => {
            if(role_checkbox.name===name) {
                role_checkbox.isChecked = !role_checkbox.isChecked;
            }
        });
        this.setState({role_checkboxs:role_checkboxs});
    }
    handleTypeCheck = name => {
        const type_checkboxs = this.state.type_checkboxs;
        type_checkboxs.forEach(type_checkbox => {
            if(type_checkbox.name===name) {
                type_checkbox.isChecked = !type_checkbox.isChecked;
            }
        });
        this.setState({type_checkboxs:type_checkboxs});
    }


    handleSearchTextChange = searchText => {
        this.setState({searchText:searchText});
    }

    handleMouseMove = (src,x,y) => {
        champs.forEach(champ => {
            
            const img_src=champ.img;
            if(src.indexOf(img_src) !== -1){
                //chơi cái so sánh == ở đây nó chả ko ra :| ::DDD
                this.setState({
                    champ:champ,
                    x:x,
                    y:y,
                    display:true
                });
            }
        });
    }
    handleMouseOut = src => {
        this.setState({display:false});
    }
    

    render(){
        return (
            <>
                <Filter 
                    role_checkboxs={this.state.role_checkboxs}
                    type_checkboxs={this.state.type_checkboxs}
                    searchText = {this.state.searchText}
                    onSearchTextChange = {this.handleSearchTextChange}
                    onRoleCheck={this.handleRoleCheck}
                    onTypeCheck={this.handleTypeCheck}
                />
                <ChampWrapper 
                    champs={champs} 
                    searchText = {this.state.searchText}
                    role_checkboxs={this.state.role_checkboxs}
                    type_checkboxs={this.state.type_checkboxs}
                    mouseMove={this.handleMouseMove}
                    mouseOut={this.handleMouseOut}
                    
                />
                <ChampToolTip
                    champ={this.state.champ}
                    display = {this.state.display}   
                    x={this.state.x}
                    y={this.state.y} 
                />
                
            </>
        );
        
    }
}

ReactDOM.render(<App/>,document.getElementById('root'));




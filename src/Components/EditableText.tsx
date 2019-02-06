import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

interface props {
  value: string;
  isEditable: boolean;
  onChange: (value: string) => void;
  label: string | undefined;
}

interface state {
  isEditMode: boolean;
  value: string;
}

class EditableText extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      isEditMode: false,
      value: props.value,
    };
  }

  componentDidUpdate() {
    if (this.state.value != this.props.value && !this.state.isEditMode) {
      this.setState({ isEditMode: false, value: this.props.value });
    }
  }

  onTextClick() {
    if (this.props.isEditable) {
      this.setState({ isEditMode: true });
    }
  }

  onKeyPress(event: any) {
    if (event.key == 'Enter') {
      this.props.onChange(this.state.value);
      this.setState({ isEditMode: false });
    } else if (event.key == 'esc') {
      this.setState({ isEditMode: false, value: this.props.value });
    }
  }
  onTextChange(event: any) {
    this.setState({ value: event.target.value });
  }

  render() {
    return (
      <div>
        {this.props.label ? (
          <div>
            {' '}
            <label>{this.props.label}</label>
          </div>
        ) : null}
        <div>
          <TextField
            disabled={!this.state.isEditMode}
            onChange={e => this.onTextChange(e)}
            onClick={() => this.onTextClick()}
            onKeyPress={e => this.onKeyPress(e)}
            value={this.state.value}
          />
        </div>
      </div>
    );
  }
}

export default EditableText;

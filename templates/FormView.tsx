import React from 'react';
import {normalize, setupPage} from "csstips";

import {Layout} from '../components/Layout';
import {FormType, Form} from '../components/Form';

interface Widget {
    name: string;
    url: string;
}

interface Props {
    form: FormType;
    widget_list: Widget[];
    csrf_token: string;
}

normalize();
setupPage('#root');

export default (props: Props) => <Layout>
    <ul>
        {props.widget_list.map(widget =>
        <li key={widget.name}>{widget.name}</li>
        )}
    </ul>
    <Form csrf_token={props.csrf_token} form={props.form} />
</Layout>;

/**
 * Dashboard component
 * author: Shaun Jorstad
 *
 * route: '/app/channel-templates'
 * purpose: page that wiill provide access to manage channel templates
 */

import React from 'react';
import Content from './Content';

export default function ChannelTemplates() {
    return (
        <Content
            head={
                <div className="channelTemplates">
                    <h1>Channel Templates: </h1>
                </div>
            }
            body={<div></div>}
        />
    );
}

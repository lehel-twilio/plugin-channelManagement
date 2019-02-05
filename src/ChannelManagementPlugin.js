import { FlexPlugin } from 'flex-plugin';
import React from 'react';
import ChannelManagement from './ChannelManagement';

export default class ChannelManagementPlugin extends FlexPlugin {
  name = 'ChannelManagementPlugin';

  init(flex, manager) {

    flex.WorkerCanvas.Content.add(<ChannelManagement key='channel-management' />);

  }
}

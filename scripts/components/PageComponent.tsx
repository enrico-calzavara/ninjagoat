import * as _ from "lodash";
import * as React from "react";

export default React.createClass({
    render() {
        let View = this.view;
        let ViewModel = this.viewmodel;
        let key = JSON.stringify(this.props.params);
        return View ? <View viewmodel={ViewModel} key={key} /> : <div></div>;
    },
    componentWillMount() {
        this.setupPage(this.props);
    },
    componentWillReceiveProps(props: any) {
        // Deadly patch to avoid duplicated render cycle due to an improper edit of context [see MaterialUi | MuiThemeProvider]
        if (_.isEqual(props.params, this.props.params)) return;

        this.viewmodel.dispose();
        this.setupPage(props);
    },
    componentWillUnmount() {
        if (this.viewmodel) this.viewmodel.dispose();
    },
    setupPage(props: any) {
        let context = props.contextFactory.contextFor(
            window.location.pathname + window.location.search,
            props.params
        );
        this.view = context.view;
        this.viewmodel = context.viewmodel;
        this.setState(this.viewmodel);
        context.viewmodel.subscribe(() => this.setState(context.viewmodel));
    }
});
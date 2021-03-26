---
layout: null
---

import wq, { modules } from 'https://unpkg.com/wq';
import markdown, { renderers } from 'https://unpkg.com/@wq/markdown@next';
import CodePen from './codepen.js';

const React = modules['react'];

renderers.code = CodePen;

wq.use(markdown);

const config = {
    site_title: 'wq Framework',
    store: {
        service: '',
        defaults: {
            format: 'json',
        },
    },
    pages: {
        {% for page in site.pages %}{% if page.wq_config %}
        {{ page.wq_config.name }}: pageConf({{ page || jsonify }}),{% endif %}{% endfor %}
    }
};

function pageConf(page) {
    if (page.dir === '/') {
        return {
            verbose_name: page.title,
            icon: page.wq_config.icon_data ? page.wq_config.name : null,
            markdown: page.content,
            ...page.wq_config,
        };
    } else {
        return {
            verbose_name_plural: page.title,
            icon: page.wq_config.icon_data ? page.wq_config.name : null,
            markdown: page.content,
            list: true,
            cache: 'all',
            can_change: false,
            can_add: false,
            ordering: ['order', 'title'],
            ...page.wq_config,
        };
    }
}

const ICONS = {
    pin: 'M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z',
};

wq.use({
    icons: makeIcons(),
    start() {
        document.getElementById('content').remove();
    },
    context(ctx, routeInfo) {
        if (routeInfo.page_config.autoindex === false) {
            return { autoindex: false };
        }
    },
    thunks: {
        RENDER(dispatch, getState, { action }) {
            const {
                router_info: { mode, page_config },
                label,
            } = action.payload;
            let title;
            if (label) {
                title = label;
            } else if (mode === 'list') {
                title = page_config.verbose_name_plural;
            } else {
                title = page_config.verbose_name;
            }
            if (title !== config.site_title) {
                title = `${title} - ${config.site_title}`;
            }
            document.title = title;
            if (location.hash) {
                const el = document.getElementById(location.hash.slice(1));
                if (el) {
                    el.scrollIntoView();
                }
            }
        },
    },
});

function Icon({ data }) {
    return React.createElement(
        'svg',
        { viewBox: '0 0 24 24', style: { width: 24, height: 24 } },
        React.createElement('path', { fill: 'currentColor', d: data })
    );
}

function makeIcons() {
    const icons = {};

    Object.entries(ICONS).forEach(makeIcon);
    Object.entries(config.pages).forEach(([name, conf]) => {
        if (conf.icon_data) {
            makeIcon([name, conf.icon_data]);
        }
    });

    function makeIcon([name, data]) {
        icons[name] = () => React.createElement(Icon, { data });
        icons[name].displayName =
            name[0].toUpperCase() + name.slice(1) + 'Icon';
    }

    return icons;
}

wq.use({
    async ajax(url, formdata, method) {
        if (method === 'POST') {
            return;
        }
        url = url.replace('.json', '/$index.json');
        const response = await fetch(url),
            data = await response.json();
        if (Array.isArray(data)) {
            return data.map(processPage);
        }
        return data;
    },
});

function processPage(page) {
    page.id = page.name.replace('.md', '');
    page.label = page.title = page.title.replace('&amp;', '&');
    page.icon = page.icon || null;
    page.order = page.order || 0;
    page.markdown = page.content;
    delete page.content;

    if (page.module) {
        page.tags = [
            {
                label: page.module,
                color: page.module.startsWith('@wq/') ? 'primary' : 'secondary',
            },
        ];
    } else if (page.tag) {
        page.tags = [
            {
                label: page.tag,
                color: page.tag_color || 'primary',
            },
        ];
    } else {
        page.tags = null;
    }
    return page;
}

wq.init(config).then(wq.prefetchAll);

import { useState, useEffect } from '@wordpress/element';
import { 
    FormTokenField, 
    Spinner 
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

const PostSelectorControl = (props) => {
    const { attributes, setAttributes, BlockEdit } = props;
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [suggestions, setSuggestions] = useState([]);

    const { query = {} } = attributes;
    const { include = [] } = query;

    // 投稿一覧を取得
    useEffect(() => {
        setLoading(true);
        apiFetch({
            path: addQueryArgs('/wp/v2/posts', {
                per_page: 100,
                _fields: 'id,title',
                orderby: 'title',
                order: 'asc',
            }),
        })
            .then((fetchedPosts) => {
                setPosts(fetchedPosts);
                
                // サジェスト用のタイトルリストを作成
                const titles = fetchedPosts.map(post => 
                    post.title.rendered || `(ID: ${post.id})`
                );
                setSuggestions(titles);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    // 選択されたIDからタイトルを取得
    const getSelectedTitles = () => {
        return include.map(id => {
            const post = posts.find(p => p.id === id);
            return post ? (post.title.rendered || `(ID: ${id})`) : `(ID: ${id})`;
        }).filter(Boolean);
    };

    // タイトルからIDを取得
    const getTitlesToIds = (titles) => {
        return titles.map(title => {
            const post = posts.find(p => 
                (p.title.rendered || `(ID: ${p.id})`) === title
            );
            return post ? post.id : null;
        }).filter(Boolean);
    };

    const handleChange = (titles) => {
        const ids = getTitlesToIds(titles);
        setAttributes({
            query: {
                ...query,
                include: ids.length > 0 ? ids : undefined,
            },
        });
    };

    const resetFilter = () => {
        setAttributes({
            query: {
                ...query,
                include: undefined,
            },
        });
    };

    return (
        <>
            <BlockEdit {...props} />
            <InspectorControls group="settings">
                {loading ? (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <Spinner />
                    </div>
                ) : (
                    (include && include.length > 0) && (
                        <div style={{ padding: '16px' }}>
                            <FormTokenField
                                label={__('投稿タイトル', 'query-loop-post-filter')}
                                value={getSelectedTitles()}
                                suggestions={suggestions}
                                onChange={handleChange}
                                placeholder={__('投稿タイトルを入力...', 'query-loop-post-filter')}
                                __experimentalShowHowTo={false}
                            />
                            <p className="components-base-control__help" style={{ marginTop: '8px' }}>
                                {__('投稿タイトルを入力して選択してください。複数選択可能です。', 'query-loop-post-filter')}
                            </p>
                        </div>
                    )
                )}
            </InspectorControls>
        </>
    );
};

export default PostSelectorControl;
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import {
    PanelBody,
    FormTokenField,
    Spinner
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEntityRecords } from '@wordpress/core-data';

/**
 * クエリーループブロックに投稿タイトルフィルターを追加
 */
const withPostTitleFilter = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        const { attributes, setAttributes, name } = props;

        if (name !== 'core/query') {
            return <BlockEdit {...props} />;
        }

        const { query = {} } = attributes;
        const { include = [], postType = 'post' } = query;

        // 投稿一覧を取得（クエリの投稿タイプに基づく）
        const { records: fetchedPosts, isResolving: loading } = useEntityRecords(
            'postType',
            postType,
            {
                per_page: 100,
                _fields: 'id,title',
                orderby: 'title',
                order: 'asc',
            }
        );

        const posts = fetchedPosts ?? [];
        const suggestions = posts.map(
            post => post.title?.rendered || `(ID: ${post.id})`
        );

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
            
            // 空の場合はincludeを削除して絞り込みを解除
            if (ids.length === 0) {
                const newQuery = { ...query };
                delete newQuery.include;
                setAttributes({ query: newQuery });
            } else {
                setAttributes({
                    query: {
                        ...query,
                        include: ids,
                    },
                });
            }
        };

        return (
            <>
                <BlockEdit {...props} />
                <InspectorControls>
                    <PanelBody 
                        title={__('投稿タイトルで絞り込む', 'query-loop-post-filter')}
                        initialOpen={include && include.length > 0}
                    >
                        {loading ? (
                            <div style={{ padding: '20px', textAlign: 'center' }}>
                                <Spinner />
                            </div>
                        ) : (
                            <>
                                <FormTokenField
                                    label={__('投稿を選択', 'query-loop-post-filter')}
                                    value={getSelectedTitles()}
                                    suggestions={suggestions}
                                    onChange={handleChange}
                                    placeholder={__('投稿タイトルを入力...', 'query-loop-post-filter')}
                                    showHowTo={false}
                                />
                                <p className="components-base-control__help" style={{ marginTop: '8px' }}>
                                    {__('投稿タイトルを入力して選択してください。複数選択可能です。', 'query-loop-post-filter')}
                                </p>
                            </>
                        )}
                    </PanelBody>
                </InspectorControls>
            </>
        );
    };
}, 'withPostTitleFilter');

addFilter(
    'editor.BlockEdit',
    'query-loop-post-filter/add-controls',
    withPostTitleFilter
);